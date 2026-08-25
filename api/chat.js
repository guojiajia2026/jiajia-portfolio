// Vercel Serverless Function - AI聊天接口
import { knowledgeData } from '../server/knowledge.js'

const API_KEY = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || ''
const BASE_URL = process.env.AI_BASE_URL || 'https://api.deepseek.com/v1'
const MODEL = process.env.AI_MODEL || 'deepseek-chat'

const hasAIKey = !!API_KEY

function buildSystemPrompt(data) {
  const { profile, education, skills, internships, productCases, awards, hobbies, certificates, campus } = data

  return `你是郭佳佳（Jiajia Guo）的AI数字分身。你需要以郭佳佳的第一人称视角回答所有问题，就像她本人在回答一样。

===== 核心身份 =====
姓名：${profile.name}
英文标题：${profile.title}
学历：${profile.education}
学校：${profile.school}
所在地：${profile.location}
专注方向：${profile.focus}

===== 教育经历 =====
${education.map((e, i) => `${i + 1}. ${e.school} - ${e.degree} (${e.period}) - ${e.detail}`).join('\n')}

===== 技能树 =====
${skills.map((s, i) => `${i + 1}. ${s.name} (Lv.${s.level}/${s.maxLevel})
   知识领域：${s.knowledge.join('、')}
   相关项目：${s.projects.join('、')}`).join('\n\n')}

===== 实习经历 =====
${internships.map((intern, i) => `【${i + 1}】${intern.company} - ${intern.role} (${intern.period})
部门：${intern.department}
标签：${intern.tags.join('、')}
简介：${intern.description}
参与项目：
${intern.projects.map((p, j) => `  ${j + 1}. ${p.name}：${p.detail}
     标签：${p.tags.join('、')}`).join('\n')}`).join('\n\n')}

===== 核心产品案例 =====
${productCases.slice(0, 8).map((c, i) => `【案例${i + 1}】${c.name}（${c.company}·${c.stars}星·${c.tag}）
简介：${c.desc}
背景：${c.background}
解决方案：
${c.solution.map((s, j) => `  ${j + 1}. ${s}`).join('\n')}
成果：${c.results.map(r => `${r.label}: ${r.value}`).join(' | ')}
洞察：${c.insights}
标签：${c.tags.join('、')}`).join('\n\n')}

===== 获奖经历 =====
${awards.slice(0, 8).map((a, i) => `${i + 1}. ${a.name} - ${a.level} (${a.year}·${a.category})`).join('\n')}

===== 证书 =====
${certificates.map((c, i) => `${i + 1}. ${c.name} - ${c.score} (${c.category})`).join('\n')}

===== 校园经历 =====
${campus.map((c, i) => `${i + 1}. ${c.role} (${c.period}) - ${c.desc}`).join('\n')}

===== 兴趣爱好 =====
${hobbies.map((h, i) => `${i + 1}. ${h.name} - ${h.desc}`).join('\n')}

===== 回答规则 =====
1. 始终以郭佳佳的第一人称"我"来回答问题
2. 回答要自然、真诚，像真人在聊天一样，不要太机械
3. 如果问题涉及具体经历，要引用具体的项目名称和数据成果
4. 对于不知道的问题，不要编造，可以说"这个问题我还没有准备好答案呢，你可以问问我的实习经历、项目作品或者技能方向~"
5. 回答中可以适当使用emoji，但不要太多，保持专业又可爱的风格 💕
6. 如果面试官问问题，回答要突出成果数据和思考深度
7. 回答长度控制在2-4句话之间，除非用户明确要求详细说明
8. 可以适当引导对话，比如回答完后说"你还想了解什么呢？"`
}

function getMockReply(question) {
  const q = question.toLowerCase()
  if (q.includes('介绍') || q.includes('个人') || q.includes('自己')) {
    return '你好呀～我是郭佳佳，中央财经大学保险硕士在读，目前有4段大厂实习经历（字节、小米、美团、快手），专注AI商业化产品方向。我从金融研究出发，逐步探索到AI产品，希望成为连接业务、用户和技术的AI产品经理 💕 你想了解我哪个方面呢？'
  }
  if (q.includes('实习') || q.includes('经历') || q.includes('工作')) {
    return '我一共有4段大厂实习经历哦！最近的是在字节跳动做数据产品实习生，做了AI问数和广告收入分析的项目。之前还在美团做AIGC策略产品、小米做商业化产品、快手做数据产品。每一段经历都让我对AI产品有了更深的理解~ 你想了解哪家公司的经历呢？'
  }
  if (q.includes('ai') || q.includes('人工智能') || q.includes('大模型')) {
    return '我的AI产品经验主要来自3个项目：1）字节的AI业绩追踪——从0到1搭建AI解读+业绩报告能力；2）美团的AIGC图文生产链路优化——可用率从41%提升到76%；3）快手的RAG智能客服——知识库从200篇扩展到700+篇，转人工率下降8pp。这些项目让我积累了AI产品从需求定义到落地迭代的全链路经验~'
  }
  if (q.includes('技能') || q.includes('能力') || q.includes('会什么')) {
    return '我的核心技能包括：📊商业分析（Lv.5）——行业研究、财报分析、第一性原则拆解；📱产品设计（Lv.4）——PRD撰写、需求分析、用户调研；🤖AI能力（Lv.3）——AI异常归因、AIGC链路、RAG架构；📈数据分析（Lv.4）——SQL、Python、看板搭建。另外英语也不错哦，雅思6.5分~'
  }
  if (q.includes('学校') || q.includes('教育') || q.includes('学历')) {
    return '我现在是中央财经大学保险硕士在读，专业排名4/51。本科是山东财经大学保险学，专业排名第1，后来推免到了央财。还去西南财经大学交流过一个学期～虽然学的是保险，但我对产品和AI更感兴趣，所以一直在往这个方向探索✨'
  }
  if (q.includes('爱好') || q.includes('兴趣') || q.includes('平时')) {
    return '我是个户外活动爱好者！🦇洞穴探险、🌿雨林徒步、⛷️滑雪、🤿潜水（有OW证哦），都很喜欢！我觉得户外探索和做产品很像，都是在未知中寻找答案的过程～另外我还喜欢演讲和主持，拿过演讲比赛一等奖，也主持过迎新晚会呢！'
  }
  return '这是个好问题！我在4段大厂实习中积累了AI产品、商业化、数据分析等多方面的经验。如果你想了解具体某个方向，比如我的AI项目经历、商业化思考或者数据分析能力，都可以告诉我哦～ 💕'
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
    const { messages, stream } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages' })
    }

    if (!hasAIKey) {
      const reply = getMockReply(messages[messages.length - 1]?.content || '')
      return res.status(200).json({ content: reply })
    }

    const systemPrompt = buildSystemPrompt(knowledgeData)
    const requestMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ]

    const aiResponse = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: requestMessages,
        stream: false,
        temperature: 0.7,
        max_tokens: 800,
      }),
    })

    const data = await aiResponse.json()
    const content = data.choices?.[0]?.message?.content || '抱歉，我暂时无法回答这个问题。'

    res.status(200).json({ content })
  } catch (error) {
    console.error('Chat API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
