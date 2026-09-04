// Vercel Serverless Function - 岗位匹配接口 (RAG增强版 - 自包含)

const API_KEY = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || ''
const BASE_URL = process.env.AI_BASE_URL || 'https://api.deepseek.com/v1'
const MODEL = process.env.AI_MODEL || 'deepseek-chat'

const hasAIKey = !!API_KEY

// ===== 知识块索引 (内联) =====
const CHUNKS = [
  { id: 'profile-001', category: 'profile', tags: ['自我介绍','背景','个人画像','简介'], content: '我是郭佳佳，中央财经大学保险硕士在读，2026年毕业。方向是AI+商业化产品，4段大厂实习（字节/美团/快手/小米）。字节做了AI问数/业绩追踪，快手独立负责智能客服RAG知识库，美团做了AIGC图文生产链路优化。爱好洞穴探险、雨林徒步、滑雪和潜水。' },
  { id: 'profile-003', category: 'profile', tags: ['核心竞争力','差异化','能力证明','优势'], content: '核心竞争力是全链路AI产品闭环能力：①快手RAG知识库②字节AI问数（Skill设计+风险归因）③美团AIGC图文链路（Prompt工程+多模态前置过滤）④独立部署AI数字分身求职网站。不仅懂AI产品设计，还懂落地部署和效果迭代。' },
  { id: 'bytedance-001', category: 'bytedance', tags: ['AI问数','背景','业绩分析'], content: '字节AI问数项目背景：中国电商3个核心数据产品提供看板+自助报表模式，用户需手动逐层下钻定位问题。目标是把人找数变成数找人。' },
  { id: 'bytedance-002', category: 'bytedance', tags: ['AI问数','技术方案','Skill','架构'], content: 'AI问数技术方案：AI能力封装为标准化Skill或Agent，能力与形态解耦。归因用大模型推理，规则引擎兜底。AI Skill不直连数据库，只调后端接口。四种产品形态。' },
  { id: 'bytedance-003', category: 'bytedance', tags: ['AI问数','风险归因','指标体系','权重','5维度'], content: '风险归因5维度：①经营健康度（发货GMV）40% ②流量20% ③内容20% ④商品15% ⑤投放5%。综合风险分=加权求和。' },
  { id: 'bytedance-004', category: 'bytedance', tags: ['AI问数','效果','准确率','灰度'], content: 'AI问数效果：每次分析省15-30分钟，准确率87.3%，灰度策略10%→全量，响应300秒内。' },
  { id: 'bytedance-005', category: 'bytedance', tags: ['数据安全','CRM','权限','治理'], content: '达人数据安全管控：定义4类角色可见范围，设计差异化展示，熔断机制。加敏覆盖率100%，618泄露0起。' },
  { id: 'bytedance-006', category: 'bytedance', tags: ['大促','618','开播','盯盘'], content: '核心作者开播盯盘：618自动创建分组，节省人力170小时/日，覆盖1400+人。' },
  { id: 'bytedance-007', category: 'bytedance', tags: ['商业分析','广告收入','归因'], content: '字节广告收入分析：三层归因框架，广告数据使用率↑5pp。' },
  { id: 'meituan-001', category: 'meituan', tags: ['AIGC看板','指标口径','方法论'], content: 'AIGC看板：方法论——指标定义先于数据实现。口径文档化后看板数字再没人质疑。' },
  { id: 'meituan-002', category: 'meituan', tags: ['AIGC','AI图文','Prompt工程','多模态','前置过滤'], content: 'AI图文链路优化：75%折损源于输入素材，多模态质量分前置，0.5/0.3双阈值。无效推理↓20%+，误杀率≤1.5%。' },
  { id: 'meituan-003', category: 'meituan', tags: ['Prompt工程','结构化Prompt','JSON'], content: 'AI图文Prompt设计：结构化模板4模块，JSON格式输出，V2分层设计稳定性大幅提升。' },
  { id: 'meituan-004', category: 'meituan', tags: ['内容审核','风控','策略产品'], content: '内容审核优化：新增M22复审和C端举报回扫，低质入库率↓10%，可用率↑2%。' },
  { id: 'kuaishou-001', category: 'kuaishou', tags: ['RAG','智能客服','知识库','转人工'], content: '快手RAG：知识库200篇覆盖率<30%，20%检索失败因嵌套引用。核心问题是知识库不完整。' },
  { id: 'kuaishou-002', category: 'kuaishou', tags: ['RAG','PRD','多路召回','冲突检测','BM25'], content: 'RAG输出3篇PRD：①入库与下钻（递归3层）②多路召回（BM25+向量+权重）③冲突检测（时效排序）。' },
  { id: 'kuaishou-003', category: 'kuaishou', tags: ['RAG','效果','转人工率','有效回复率'], content: 'RAG效果：有效回复率↑5pp，转人工率↓15pp，知识库200→700+篇，耗时-2秒。覆盖率42.8%。' },
  { id: 'kuaishou-004', category: 'kuaishou', tags: ['商业分析','广告收入','广告医生'], content: '快手广告医生：流量×转化率×单价拆解，第一性原则分析框架。' },
  { id: 'xiaomi-001', category: 'xiaomi', tags: ['竞品分析','会员体系','商业化','Keep','华为'], content: '小米会员竞品：渗透率0.61%，拆解华为/Keep/训记/Apple。价格不是瓶颈，开通页引导才是。Keep 9.0拐点。' },
  { id: 'xiaomi-002', category: 'xiaomi', tags: ['商业化','支付链路','增长','抖音支付'], content: '小米抖音支付：支付转化↑3%，优惠点击率↑10%+。' },
  { id: 'xiaomi-003', category: 'xiaomi', tags: ['增长活动','社交裂变','会员','赠礼'], content: '小米亲友赠礼：分享率↑8%，但整体营收无显著提升。' },
  { id: 'xiaomi-004', category: 'xiaomi', tags: ['内容策略','会员体系','助眠','音频'], content: '小米助眠音频：200首，免费+VIP分层，使用时长↑10%~15%。' },
  { id: 'skills-001', category: 'skills', tags: ['技能树','能力','商业分析','AI','数据','产品'], content: '技能树：商业分析Lv.5、产品设计Lv.4、AI能力Lv.3、数据分析Lv.4。' },
  { id: 'awards-001', category: 'awards', tags: ['获奖','竞赛','数学建模','互联网+','奖学金'], content: '13项获奖：APMCM全国一等奖、互联网+银奖铜奖、新婧杯铜奖、美赛H奖等。' },
  { id: 'campus-001', category: 'campus', tags: ['校园经历','学生会','权益部','支农'], content: '校园：权益部部长（服务200+人次，最佳部门）、支农促进会副会长（6部门80人，优秀骨干）。' },
  { id: 'hobbies-001', category: 'hobbies', tags: ['爱好','户外','运动','潜水','滑雪','跳舞'], content: '爱好：洞穴探险、雨林徒步、滑雪、潜水（OW证）。跳舞、羽毛球、游泳。做过晚会主持人。' },
  { id: 'method-001', category: 'methodology', tags: ['AI幻觉','Prompt','温度参数','RAG'], content: 'AI幻觉三层防护：Prompt禁止编造+温度参数控制+强制引用事实。' },
  { id: 'method-002', category: 'methodology', tags: ['效果评估','AI产品','评估标准','灰度'], content: 'AI效果评估：事实准确性、风格一致性、针对性、在线可用性。灰度策略10%→全量。' },
  { id: 'website-001', category: 'website', tags: ['求职网站','AI数字分身','RAG','Vercel','DeepSeek'], content: 'AI数字分身求职网站：RAG问答+岗位匹配，React+Vite+TS，Vercel Serverless+SSE流式。' },
  { id: 'certs-001', category: 'certificates', tags: ['证书','英语','潜水','银行','计算机'], content: '证书8项：CET-4（600）、CET-6（590）、雅思6.5、OW潜水证、银行从业、计算机二级、普通话二甲、C1驾照。' },
]

function tokenize(text) {
  const tokens = []
  const cleaned = (text || '').toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9\s]/g, ' ')
  const enWords = cleaned.match(/[a-z0-9]+/g) || []
  tokens.push(...enWords)
  const chineseOnly = cleaned.replace(/[a-z0-9\s]/g, '')
  for (let len = 2; len <= 4; len++) {
    for (let i = 0; i <= chineseOnly.length - len; i++) {
      tokens.push(chineseOnly.slice(i, i + len))
    }
  }
  return tokens
}

function retrieve(query, topK) {
  topK = topK || 8
  const queryTokens = tokenize(query)
  const scores = []
  
  CHUNKS.forEach((chunk, idx) => {
    let score = 0
    const chunkText = chunk.content + ' ' + chunk.tags.join(' ')
    const chunkTokens = tokenize(chunkText)
    const chunkTokenSet = new Set(chunkTokens)
    
    queryTokens.forEach(token => {
      if (chunkTokenSet.has(token)) score += 1
    })
    
    chunk.tags.forEach(tag => {
      if (query.includes(tag) || tag.includes(query)) score += 5
      const tagChars = tag.split('')
      let matchCount = 0
      tagChars.forEach(ch => { if (query.includes(ch)) matchCount++ })
      if (matchCount >= tagChars.length * 0.5) score += 2
    })
    
    if (query.toLowerCase().includes(chunk.category)) score += 3
    if (score > 0) scores.push({ chunk, score, idx })
  })
  
  scores.sort((a, b) => b.score - a.score)
  return scores.slice(0, topK).map(s => s.chunk)
}

function getMockMatchResult(position) {
  return {
    score: 82,
    position: position || '该岗位',
    level: '较为匹配',
    summary: `郭佳佳在AI产品、商业化分析、数据能力方面与${position || '该岗位'}岗位高度契合，4段大厂实习提供扎实项目经验。`,
    matches: [
      { requirement: 'AI产品经验', stars: 4, evidence: '字节AI业绩追踪、美团AIGC图文、快手RAG智能客服等3个AI项目' },
      { requirement: '产品设计能力', stars: 4, evidence: '独立输出多篇PRD，覆盖数据/AI/商业化产品' },
      { requirement: '商业分析能力', stars: 5, evidence: '第一性原则拆解分析框架，1.5w字调研报告' },
      { requirement: '数据分析能力', stars: 4, evidence: 'SQL/Python/看板搭建，多个从0到1数据产品' },
    ],
    gaps: ['Agent开发经验较少', '模型评估经验有待补充', 'to C产品经验相对较少'],
    highlights: ['金融+AI复合背景，商业化敏感度高', '4段大厂实习（字节/美团/快手/小米）', '从0到1产品落地能力强，有明确数据成果', '学习能力强，专业排名靠前，13项获奖'],
    recommendations: ['补充Agent开发相关项目经验', '学习模型评估指标和方法', '积累更多to C产品视角'],
    elevatorPitch: `你好，我是郭佳佳，中央财经大学保险硕士，4段大厂实习，专注AI商业化产品。字节做过AI业绩追踪，美团做过AIGC图文链路，快手做过RAG智能客服，既有AI产品落地经验，也有商业分析和数据产品能力。我相信我的背景能为${position || '该岗位'}带来独特价值！`,
  }
}

export default async function handler(req, res) {
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
    const { jd, position } = req.body || {}

    if (!jd || !position) {
      return res.status(400).json({ error: 'Missing jd or position' })
    }

    if (!hasAIKey) {
      return res.status(200).json(getMockMatchResult(position))
    }

    // RAG: 根据JD检索知识块
    const retrieved = retrieve(jd + ' ' + position, 8)
    let context = ''
    retrieved.forEach((chunk, i) => {
      context += `[${i + 1}] (${chunk.category}) ${chunk.content}\n\n`
    })
    
    // 始终包含画像和技能
    const profileChunk = CHUNKS.find(c => c.id === 'profile-001')
    const skillsChunk = CHUNKS.find(c => c.id === 'skills-001')
    if (profileChunk && !retrieved.find(c => c.id === 'profile-001')) {
      context = `[基本画像] ${profileChunk.content}\n\n` + context
    }
    if (skillsChunk && !retrieved.find(c => c.id === 'skills-001')) {
      context += `[技能树] ${skillsChunk.content}\n\n`
    }

    const systemPrompt = `你是一个专业的AI招聘评估助手，负责评估候选人郭佳佳与目标岗位的匹配度。

===== 候选人知识库 =====
${context}

===== 评估规则 =====
根据JD评估匹配度，输出严格JSON格式：
{
  "score": 0-100,
  "position": "岗位名称",
  "level": "高度匹配/较为匹配/部分匹配/匹配度较低",
  "summary": "一句话总结",
  "matches": [{"requirement":"","stars":1-5,"evidence":""}],
  "gaps": ["待提升方面"],
  "highlights": ["核心亮点"],
  "recommendations": ["成长建议"],
  "elevatorPitch": "30秒自我介绍话术"
}
评估维度：硬技能/项目经验/行业理解/软技能/成长潜力。
每个匹配点必须引用候选人具体经历。客观公正，不过度吹捧。`

    const userPrompt = `目标岗位：${position}\n\n岗位描述（JD）：\n${jd}\n\n请评估匹配度，输出JSON结果。`

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

    if (!aiResponse.ok) {
      console.error('AI API error:', aiResponse.status)
      return res.status(200).json(getMockMatchResult(position))
    }

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
    const { position } = req.body || {}
    res.status(200).json(getMockMatchResult(position || '该岗位'))
  }
}
