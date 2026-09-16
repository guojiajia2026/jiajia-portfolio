// Vercel Serverless Function - 岗位匹配接口 (RAG增强版 - 自包含 + 透明评分)

const API_KEY = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || ''
const BASE_URL = process.env.AI_BASE_URL || 'https://api.deepseek.com/v1'
const MODEL = process.env.AI_MODEL || 'deepseek-chat'

const hasAIKey = !!API_KEY

// ===== 知识块索引 (内联) =====
const CHUNKS = [
  { id: 'profile-001', category: 'profile', tags: ['自我介绍','背景','个人画像','简介'], content: '我是郭佳佳，中央财经大学保险硕士在读，2026年毕业。方向是AI+商业化产品，4段大厂实习（字节/美团/快手/小米）。字节做了AI问数/业绩追踪，快手独立负责智能客服RAG知识库，美团做了AIGC图文生产链路优化。爱好洞穴探险、雨林徒步、滑雪和潜水。' },
  { id: 'profile-003', category: 'profile', tags: ['核心竞争力','差异化','能力证明','优势'], content: '核心竞争力是全链路AI产品闭环能力：①快手RAG知识库②字节AI问数（Skill设计+风险归因）③美团AIGC图文链路（Prompt工程+多模态前置过滤）④独立部署AI数字分身求职网站。不仅懂AI产品设计，还懂落地部署和效果迭代。' },
  { id: 'bytedance-001', category: 'bytedance', tags: ['AI问数','背景','业绩分析','字节跳动','问数'], content: '字节AI问数项目背景：中国电商3个核心数据产品提供看板+自助报表模式，用户需手动逐层下钻定位问题。目标是把人找数变成数找人。' },
  { id: 'bytedance-002', category: 'bytedance', tags: ['AI问数','技术方案','Skill','架构','Agent'], content: 'AI问数技术方案：AI能力封装为标准化Skill或Agent，能力与形态解耦。归因用大模型推理，规则引擎兜底。四种产品形态：AI助手对话框、结构化卡片回复、AI解读卡片、对话式完整报告。' },
  { id: 'bytedance-003', category: 'bytedance', tags: ['AI问数','风险归因','指标体系','权重','5维度'], content: '风险归因5维度：①经营健康度（发货GMV）40% ②流量20% ③内容20% ④商品15% ⑤投放5%。综合风险分=加权求和。' },
  { id: 'bytedance-004', category: 'bytedance', tags: ['AI问数','效果','准确率','灰度'], content: 'AI问数效果：每次分析省15-30分钟，准确率87.3%，灰度策略10%→全量，响应300秒内。' },
  { id: 'bytedance-005', category: 'bytedance', tags: ['数据安全','CRM','权限','治理','达人'], content: '达人数据安全管控：定义4类角色可见范围，设计差异化展示，熔断机制。加敏覆盖率100%，618泄露0起。' },
  { id: 'bytedance-006', category: 'bytedance', tags: ['大促','618','开播','盯盘','核心作者'], content: '核心作者开播盯盘：618自动创建分组，节省人力170小时/日，覆盖1400+人。' },
  { id: 'bytedance-007', category: 'bytedance', tags: ['商业分析','广告收入','归因'], content: '字节广告收入分析：三层归因框架，广告数据使用率↑5pp。' },
  { id: 'meituan-001', category: 'meituan', tags: ['AIGC看板','指标口径','方法论','美团'], content: 'AIGC看板：方法论——指标定义先于数据实现。口径文档化后看板数字再没人质疑。' },
  { id: 'meituan-002', category: 'meituan', tags: ['AIGC','AI图文','Prompt工程','多模态','前置过滤','美团'], content: 'AI图文链路优化：75%折损源于输入素材，多模态质量分前置，0.5/0.3双阈值。无效推理↓20%+，误杀率≤1.5%。' },
  { id: 'meituan-003', category: 'meituan', tags: ['Prompt工程','结构化Prompt','JSON','美团'], content: 'AI图文Prompt设计：结构化模板4模块，JSON格式输出，V2分层设计稳定性大幅提升。' },
  { id: 'meituan-004', category: 'meituan', tags: ['内容审核','风控','策略产品','美团'], content: '内容审核优化：新增M22复审和C端举报回扫，低质入库率↓10%，可用率↑2%。' },
  { id: 'kuaishou-001', category: 'kuaishou', tags: ['RAG','智能客服','知识库','转人工','快手'], content: '快手RAG：知识库200篇覆盖率<30%，20%检索失败因嵌套引用。核心问题是知识库不完整。' },
  { id: 'kuaishou-002', category: 'kuaishou', tags: ['RAG','PRD','多路召回','冲突检测','BM25','快手'], content: 'RAG输出3篇PRD：①入库与下钻（递归3层）②多路召回（BM25+向量+权重）③冲突检测（时效排序）。' },
  { id: 'kuaishou-003', category: 'kuaishou', tags: ['RAG','效果','转人工率','有效回复率','快手'], content: 'RAG效果：有效回复率↑5pp，转人工率↓15pp，知识库200→700+篇，耗时-2秒。覆盖率42.8%。' },
  { id: 'kuaishou-004', category: 'kuaishou', tags: ['商业分析','广告收入','广告医生','快手'], content: '快手广告医生：流量×转化率×单价拆解，第一性原则分析框架。' },
  { id: 'xiaomi-001', category: 'xiaomi', tags: ['竞品分析','会员体系','商业化','Keep','华为','小米'], content: '小米会员竞品：渗透率0.61%，拆解华为/Keep/训记/Apple。价格不是瓶颈，开通页引导才是。Keep 9.0拐点。结论：做小米硬件用户的健康服务会员。' },
  { id: 'xiaomi-002', category: 'xiaomi', tags: ['商业化','支付链路','增长','抖音支付','小米'], content: '小米抖音支付：支付转化↑3%，优惠点击率↑10%+。' },
  { id: 'xiaomi-003', category: 'xiaomi', tags: ['增长活动','社交裂变','会员','赠礼','小米'], content: '小米亲友赠礼：分享率↑8%，但整体营收无显著提升。' },
  { id: 'xiaomi-004', category: 'xiaomi', tags: ['内容策略','会员体系','助眠','音频','小米'], content: '小米助眠音频：200首，免费+VIP分层，使用时长↑10%~15%。' },
  { id: 'skills-001', category: 'skills', tags: ['技能树','能力','商业分析','AI','数据','产品'], content: '技能树：商业分析Lv.5、产品设计Lv.4、AI能力Lv.3、数据分析Lv.4。' },
  { id: 'awards-001', category: 'awards', tags: ['获奖','竞赛','数学建模','互联网+','奖学金'], content: '13项获奖：APMCM全国一等奖、互联网+银奖铜奖、新婧杯铜奖、美赛H奖等。' },
  { id: 'campus-001', category: 'campus', tags: ['校园经历','学生会','权益部','支农'], content: '校园：权益部部长（服务200+人次，最佳部门）、支农促进会副会长（6部门80人，优秀骨干）。' },
  { id: 'hobbies-001', category: 'hobbies', tags: ['爱好','户外','运动','潜水','滑雪','跳舞'], content: '爱好：洞穴探险、雨林徒步、滑雪、潜水（OW证）。跳舞、羽毛球、游泳。' },
  { id: 'method-001', category: 'methodology', tags: ['AI幻觉','Prompt','温度参数','RAG'], content: 'AI幻觉三层防护：Prompt禁止编造+温度参数控制+强制引用事实。' },
  { id: 'method-002', category: 'methodology', tags: ['效果评估','AI产品','评估标准','灰度'], content: 'AI效果评估：事实准确性、风格一致性、针对性、在线可用性。灰度策略10%→全量。' },
  { id: 'website-001', category: 'website', tags: ['求职网站','AI数字分身','RAG','Vercel','DeepSeek'], content: 'AI数字分身求职网站：RAG问答+岗位匹配，React+Vite+TS，Vercel Serverless+SSE流式。' },
  { id: 'certs-001', category: 'certificates', tags: ['证书','英语','潜水','银行','计算机'], content: '证书8项：CET-4（600）、CET-6（590）、雅思6.5、OW潜水证、银行从业、计算机二级、普通话二甲、C1驾照。' },
]

// 公司名别名映射
const COMPANY_ALIASES = {
  '小米': 'xiaomi', 'xiaomi': 'xiaomi', '红米': 'xiaomi',
  '字节': 'bytedance', 'bytedance': 'bytedance', '字节跳动': 'bytedance', '抖音': 'bytedance',
  '美团': 'meituan', 'meituan': 'meituan',
  '快手': 'kuaishou', 'kuaishou': 'kuaishou',
}

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
  const queryLower = query.toLowerCase()
  const queryTokens = tokenize(query)
  const scores = []

  const matchedCategories = new Set()
  for (const [alias, cat] of Object.entries(COMPANY_ALIASES)) {
    if (queryLower.includes(alias.toLowerCase())) {
      matchedCategories.add(cat)
    }
  }

  CHUNKS.forEach((chunk, idx) => {
    let score = 0
    const chunkText = chunk.content + ' ' + chunk.tags.join(' ')
    const chunkTokens = tokenize(chunkText)
    const chunkTokenSet = new Set(chunkTokens)

    if (matchedCategories.has(chunk.category)) score += 20

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

    if (queryLower.includes(chunk.category)) score += 3
    if (score > 0) scores.push({ chunk, score, idx })
  })

  scores.sort((a, b) => b.score - a.score)
  let results = scores.slice(0, topK).map(s => s.chunk)

  if (matchedCategories.size > 0) {
    const existingIds = new Set(results.map(r => r.id))
    for (const cat of matchedCategories) {
      CHUNKS.forEach(chunk => {
        if (chunk.category === cat && !existingIds.has(chunk.id)) {
          results.push(chunk)
          existingIds.add(chunk.id)
        }
      })
    }
  }

  return results
}

// 项目链接映射（跳转到网站对应板块）
const PROJECT_LINKS = {
  'AI问数': '#explore',
  'AI业绩追踪': '#explore',
  'AIGC': '#explore',
  'AI图文': '#explore',
  'RAG': '#explore',
  '智能客服': '#explore',
  '会员体系': '#explore',
  '竞品分析': '#explore',
  '广告收入': '#explore',
  '数据安全': '#explore',
  '内容审核': '#explore',
  '字节': '#profile',
  '美团': '#profile',
  '快手': '#profile',
  '小米': '#profile',
}

function getMockMatchResult(position) {
  return {
    score: 82,
    position: position || '该岗位',
    level: '较为匹配',
    summary: `郭佳佳在AI产品、商业化分析、数据能力方面与${position || '该岗位'}岗位有较强契合度，4段大厂实习提供扎实项目经验支撑。`,
    dimensions: [
      { name: '硬技能匹配', score: 80, weight: 30, evidence: 'SQL/Python/数据看板搭建，AI异常归因，Prompt工程，RAG架构理解', links: [{ text: '快手RAG智能客服', url: '#explore' }, { text: '美团AIGC图文链路', url: '#explore' }] },
      { name: '项目经验', score: 85, weight: 30, evidence: '4段大厂实习，3个AI相关项目（字节AI问数、美团AIGC、快手RAG），均有明确数据成果', links: [{ text: '字节AI问数', url: '#explore' }, { text: '美团AIGC图文', url: '#explore' }, { text: '快手RAG智能客服', url: '#explore' }] },
      { name: '行业理解', score: 82, weight: 20, evidence: '金融+AI复合背景，从民生证券行业研究到字节电商数据，商业化敏感度高', links: [{ text: '实习经历详情', url: '#profile' }] },
      { name: '软技能', score: 88, weight: 10, evidence: '权益部部长/支农促进会副会长，13项竞赛获奖，院迎新晚会主持人', links: [{ text: '校园经历', url: '#profile' }, { text: '获奖详情', url: '#profile' }] },
      { name: '成长潜力', score: 78, weight: 10, evidence: '专业排名靠前，自学AI产品部署，持续探索新方向', links: [] },
    ],
    matches: [
      { requirement: 'AI产品经验', stars: 4, evidence: '字节AI业绩追踪、美团AIGC图文生产链路、快手RAG智能客服等3个AI项目', link: '#explore' },
      { requirement: '产品设计能力', stars: 4, evidence: '独立输出多篇PRD，覆盖数据/AI/商业化产品', link: '#profile' },
      { requirement: '商业分析能力', stars: 5, evidence: '第一性原则拆解分析框架，1.5w字调研报告', link: '#profile' },
      { requirement: '数据分析能力', stars: 4, evidence: 'SQL/Python/看板搭建，多个从0到1数据产品', link: '#profile' },
    ],
    gaps: ['Agent开发经验较少', '模型评估经验有待补充', 'to C产品经验相对较少'],
    highlights: [
      '金融+AI复合背景，商业化敏感度高',
      '4段大厂实习（字节/美团/快手/小米）',
      '从0到1产品落地能力强，有明确数据成果',
      '学习能力强，专业排名靠前，13项获奖',
    ],
    recommendations: ['补充Agent开发相关项目经验', '学习模型评估指标和方法', '积累更多to C产品视角'],
    elevatorPitch: `你好，我是郭佳佳，中央财经大学保险硕士，4段大厂实习，专注AI商业化产品。字节做过AI业绩追踪，美团做过AIGC图文链路，快手做过RAG智能客服，既有AI产品落地经验，也有商业分析和数据产品能力。我相信我的背景能为${position || '该岗位'}带来独特价值！`,
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { jd, position } = req.body || {}
    if (!jd || !position) return res.status(400).json({ error: 'Missing jd or position' })

    if (!hasAIKey) return res.status(200).json(getMockMatchResult(position))

    const retrieved = retrieve(jd + ' ' + position, 8)
    let context = ''
    retrieved.forEach((chunk, i) => {
      context += `[${i + 1}] (${chunk.category}) ${chunk.content}\n\n`
    })

    const profileChunk = CHUNKS.find(c => c.id === 'profile-001')
    const skillsChunk = CHUNKS.find(c => c.id === 'skills-001')
    if (profileChunk && !retrieved.find(c => c.id === 'profile-001')) {
      context = `[基本画像] ${profileChunk.content}\n\n` + context
    }
    if (skillsChunk && !retrieved.find(c => c.id === 'skills-001')) {
      context += `[技能树] ${skillsChunk.content}\n\n`
    }

    const systemPrompt = `你是一位资深AI招聘评估专家，正在为HR评估候选人郭佳佳与目标岗位的匹配度。

===== 候选人知识库 =====
${context}

===== 评分规则（透明化计算） =====
你需要从5个维度评分，每个维度0-100分，权重如下：
1. 硬技能匹配（权重30%）：JD中要求的技能/工具/方法，候选人是否具备
2. 项目经验（权重30%）：JD中要求的经验类型，候选人是否有对应用户/场景/规模的实践
3. 行业理解（权重20%：JD所在行业/赛道，候选人是否有认知深度
4. 软技能（权重10%）：沟通/领导力/学习力/抗压能力
5. 成长潜力（权重10%）：学习能力、职业规划清晰度、自我驱动证据

最终得分 = Σ(维度得分 × 权重)

每个维度必须给出：
- score: 0-100
- evidence: 引用候选人具体经历作为证据（不要泛泛而谈）

===== 项目链接映射 =====
在matches和dimensions的links字段中，为每个引用的项目/经历添加跳转链接：
- 实习经历相关 → { text: "实习经历详情", url: "#profile" }
- AI项目相关 → { text: "项目名称", url: "#explore" }
- 校园/获奖相关 → { text: "校园经历", url: "#profile" }

===== 输出格式（严格JSON） =====
{
  "score": 最终加权得分(整数),
  "position": "岗位名称",
  "level": "高度匹配(85+) / 较为匹配(70-84) / 部分匹配(55-69) / 匹配度较低(<55)",
  "summary": "一句话总结匹配情况",
  "dimensions": [
    { "name": "维度名", "score": 0-100, "weight": 权重数字, "evidence": "证据", "links": [{"text":"","url":"#profile或#explore"}] }
  ],
  "matches": [
    { "requirement": "JD要求", "stars": 1-5, "evidence": "候选人证据", "link": "#profile或#explore" }
  ],
  "gaps": ["待提升方面1", "待提升方面2"],
  "highlights": ["核心亮点1", "核心亮点2"],
  "recommendations": ["成长建议1", "成长建议2"],
  "elevatorPitch": "30秒自我介绍话术（第一人称，针对该岗位定制）"
}

===== 注意 =====
- 评分要客观公正，不要过度吹捧也不要刻意贬低
- 每个evidence必须引用知识库中的具体项目/数据
- 如果某维度JD没有明确要求，给中性偏上分数（70-75）
- elevatorPitch要针对该岗位定制，突出最匹配的1-2个经历`

    const userPrompt = `目标岗位：${position}\n\n岗位描述（JD）：\n${jd}\n\n请按评分规则评估匹配度，输出JSON结果。`

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
        max_tokens: 2000,
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
      } catch {
        result = getMockMatchResult(position)
      }
    } else {
      result = getMockMatchResult(position)
    }

    result = {
      score: Math.round(result.score) || 75,
      position: result.position || position,
      level: result.level || '较为匹配',
      summary: result.summary || '',
      dimensions: result.dimensions || [],
      matches: (result.matches || []).map(m => ({
        requirement: m.requirement || '',
        stars: m.stars || 3,
        evidence: m.evidence || '',
        link: m.link || '#explore',
      })),
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
