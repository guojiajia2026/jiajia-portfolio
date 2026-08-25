// Vercel Serverless Function - 岗位匹配接口
import { knowledgeData } from '../server/knowledge.js'

const API_KEY = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || ''
const BASE_URL = process.env.AI_BASE_URL || 'https://api.deepseek.com/v1'
const MODEL = process.env.AI_MODEL || 'deepseek-chat'

const hasAIKey = !!API_KEY

function buildMatchSystemPrompt(data) {
  const { profile, skills, internships, productCases, awards } = data

  return `你是一个专业的AI招聘评估助手，负责评估候选人郭佳佳与目标岗位的匹配度。

===== 候选人信息 =====
姓名：${profile.name}
学历：${profile.education}
学校：${profile.school}
专注方向：${profile.focus}

===== 技能评估 =====
${skills.map(s => `- ${s.name}: Lv.${s.level}/${s.maxLevel}，掌握${s.knowledge.join('、')}`).join('\n')}

===== 实习经历 =====
${internships.map((intern, i) => `【${i + 1}】${intern.company} - ${intern.role} (${intern.period})
部门：${intern.department}
核心项目：${intern.projects.map(p => p.name).join('、')}`).join('\n\n')}

===== 核心项目成果 =====
${productCases.filter(c => c.stars >= 4).map(c => `- ${c.name}（${c.company}）：${c.desc}。成果：${c.results.map(r => `${r.label}${r.value}`).join('，')}`).join('\n')}

===== 获奖情况 =====
${awards.slice(0, 5).map(a => `- ${a.name} (${a.level})`).join('\n')}

===== 评估规则 =====
请根据用户提供的岗位描述（JD）和目标岗位名称，进行专业的匹配度分析。输出必须是严格的JSON格式，包含以下字段：

{
  "score": 0-100的数字,
  "position": "岗位名称",
  "level": "高度匹配/较为匹配/部分匹配/匹配度较低",
  "summary": "一句话总结匹配情况",
  "matches": [
    {
      "requirement": "岗位要求点",
      "stars": 1-5的数字,
      "evidence": "匹配证据，引用具体经历"
    }
  ],
  "gaps": [
    "待提升的方面"
  ],
  "highlights": [
    "核心亮点，候选人的独特优势"
  ],
  "recommendations": [
    "成长建议"
  ],
  "elevatorPitch": "30秒自我介绍话术，针对这个岗位优化"
}

评估维度：
1. 硬技能匹配（工具、技术、方法论）
2. 项目经验匹配（相关度、成果数据）
3. 行业/业务理解匹配
4. 软技能匹配（沟通、协作、学习能力）
5. 成长潜力

注意：
- 要有理有据，每个匹配点都要引用候选人的具体经历
- 客观公正，不要过度吹捧
- 亮点部分要突出候选人的差异化优势
- elevatorPitch要简洁有力，30秒内能说完`
}

function getMockMatchResult(position) {
  return {
    score: 82,
    position,
    level: '较为匹配',
    summary: `郭佳佳在AI产品、商业化分析、数据能力方面与${position}岗位高度契合，4段大厂实习提供了扎实的项目经验支撑。`,
    matches: [
      { requirement: 'AI产品经验', stars: 4, evidence: '字节AI业绩追踪、美团AIGC图文生产链路、快手RAG智能客服等3个AI相关项目' },
      { requirement: '产品设计能力', stars: 4, evidence: '独立输出多篇PRD，覆盖数据产品、AI产品、商业化等多个方向' },
      { requirement: '商业分析能力', stars: 5, evidence: '从金融研究到互联网商业化，具备第一性原则拆解分析框架' },
      { requirement: '数据分析能力', stars: 4, evidence: 'SQL/Python/看板搭建，多个从0到1的数据产品项目' },
    ],
    gaps: [
      'Agent开发与编排经验较少',
      '模型评估与微调经验有待补充',
      'to C产品经验相对较少',
    ],
    highlights: [
      '金融+AI复合背景，商业化敏感度高',
      '4段大厂实习经历，字节/美团/快手/小米全覆盖',
      '从0到1的产品落地能力强，多个项目有明确数据成果',
      '学习能力强，专业排名靠前，多次获奖',
    ],
    recommendations: [
      '补充Agent开发相关的项目经验',
      '学习模型评估指标和方法',
      '积累更多to C产品视角',
    ],
    elevatorPitch: `你好，我是郭佳佳，中央财经大学保险硕士，有4段大厂实习经历，专注AI商业化产品方向。我在字节做过AI业绩追踪产品，在美团做过AIGC图文生产链路优化，在快手做过RAG智能客服知识库，既有AI产品落地经验，也有商业分析和数据产品的复合能力。我相信我的背景能为${position}岗位带来独特的价值！`,
  }
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { jd, position } = req.body

    if (!jd || !position) {
      return res.status(400).json({ error: 'Missing jd or position' })
    }

    if (!hasAIKey) {
      const result = getMockMatchResult(position)
      return res.status(200).json(result)
    }

    const systemPrompt = buildMatchSystemPrompt(knowledgeData)
    const userPrompt = `目标岗位：${position}\n\n岗位描述（JD）：\n${jd}\n\n请根据以上岗位描述，评估郭佳佳与该岗位的匹配度，输出严格的JSON格式结果。`

    const aiResponse = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        stream: false,
        temperature: 0.3,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      }),
    })

    const data = await aiResponse.json()
    const content = data.choices?.[0]?.message?.content

    let result
    if (content) {
      try {
        result = JSON.parse(content)
      } catch (e) {
        result = getMockMatchResult(position)
      }
    } else {
      result = getMockMatchResult(position)
    }

    // 验证并补全结果
    result = {
      score: result.score || 75,
      position: result.position || position,
      level: result.level || '较为匹配',
      summary: result.summary || '',
      matches: result.matches || [],
      gaps: result.gaps || [],
      highlights: result.highlights || [],
      recommendations: result.recommendations || [],
      elevatorPitch: result.elevatorPitch || '',
    }

    res.status(200).json(result)
  } catch (error) {
    console.error('Match API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
