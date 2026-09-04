// Vercel Serverless Function - AI聊天接口 (RAG增强版 - 自包含)

const API_KEY = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || ''
const BASE_URL = process.env.AI_BASE_URL || 'https://api.deepseek.com/v1'
const MODEL = process.env.AI_MODEL || 'deepseek-chat'

const hasAIKey = !!API_KEY

// ===== 知识块索引 (内联，避免外部import失败) =====
const CHUNKS = [
  { id: 'profile-001', category: 'profile', tags: ['自我介绍','背景','个人画像','简介','你是谁'], content: '我是郭佳佳，中央财经大学保险硕士在读，2026年毕业。方向是AI+商业化产品，在字节跳动、美团、快手、小米有4段大厂实习，覆盖数据产品、策略产品、商业化三个方向。字节做了AI问数/业绩追踪，快手独立负责智能客服RAG知识库，美团做了AIGC图文生产链路优化。爱好洞穴探险、雨林徒步、滑雪和潜水。' },
  { id: 'profile-002', category: 'profile', tags: ['求职动机','AI方向','职业规划','为什么','选择'], content: '选择AI产品方向三个原因：第一，快手做智能客服RAG时亲手做了知识库200→700+篇、转人工率↓15pp，感受到AI产品懂边界比懂算法更重要。第二，字节做AI问数时把风险商家翻译成5维可量化指标体系，发现AI产品经理核心能力是把模糊业务问题翻译成可执行AI方案。第三，AI行业正从能力验证到业务闭环的拐点，商业分析+数据产品+AI实践经验正好匹配。' },
  { id: 'profile-003', category: 'profile', tags: ['核心竞争力','差异化','能力证明','优势','匹配'], content: '核心竞争力是全链路AI产品闭环能力：①快手做了RAG知识库（检索优化）②字节做了AI问数（Skill设计+风险归因）③美团做了AIGC图文链路（Prompt工程+多模态前置过滤）④独立从0到1设计部署含AI数字分身的求职网站（Prompt工程+Vercel Serverless+DeepSeek API）。不仅懂AI产品设计，还懂落地部署和效果迭代。' },
  { id: 'profile-004', category: 'education', tags: ['教育','学校','专业排名','学历','大学','中央财经','山东财经'], content: '本科山东财经大学保险学专业排名第1，推免到中央财经大学读保险硕士，目前专业排名4/51。本科期间在西南财经大学交流学习，专业排名4/51。中共党员。' },
  { id: 'bytedance-001', category: 'bytedance', tags: ['AI问数','背景','业绩分析','问题','字节'], content: '字节AI问数项目背景：中国电商有3个核心数据产品（工作台/大屏/全景），提供看板+自助报表模式，用户需手动筛选时间、维度、指标逐层下钻才能定位问题。目标是把人找数变成数找人，让小二打开工作台就能直接看到哪个商家有风险、为什么有风险、该怎么跟进。' },
  { id: 'bytedance-002', category: 'bytedance', tags: ['AI问数','技术方案','Skill','架构','Agent','方案'], content: 'AI问数技术方案：把AI能力封装为标准化Skill或Agent，前端通过不同产品形态调用，实现能力与形态解耦。归因用大模型推理，数值异常检测用规则引擎兜底。AI Skill不直连数据库，只调用后端封装好的指标接口。四种产品形态：AI助手对话框、结构化卡片回复、AI解读卡片、对话式完整报告。' },
  { id: 'bytedance-003', category: 'bytedance', tags: ['AI问数','风险归因','指标体系','权重','5维度','归因'], content: 'AI问数风险归因5维度：访谈10位商家运营，把风险商家翻译成可量化指标体系。①经营健康度（发货GMV）40% ②流量（曝光UV/自然/付费）20% ③内容（开播时长/频次/GPM）20% ④商品（点击率/转化率/客单价）15% ⑤投放（广告消耗/ROI）5%。综合风险分=加权求和。' },
  { id: 'bytedance-004', category: 'bytedance', tags: ['AI问数','效果','数据','准确率','灰度','结果'], content: 'AI问数效果：①每次业绩分析省15-30分钟 ②准确率87.3%，灰度策略先跑10%流量、人审抽检100%、两周后全量 ③响应时长300秒内。后续方向：从AI告诉我哪里有问题走向AI帮我把问题处理掉，低风险自动执行，高风险保留人工确认。' },
  { id: 'bytedance-005', category: 'bytedance', tags: ['数据安全','CRM','权限','治理','达人','安全'], content: '达人数据安全管控：3个核心数据产品中头部达人数据缺乏精细化管理。定义4类角色数据可见范围，与安全部门对齐数据等级，设计PC/移动端差异化展示，设定超部门8分位查看次数自动上报的熔断机制。加敏覆盖率100%，618数据泄露0起。' },
  { id: 'bytedance-006', category: 'bytedance', tags: ['大促','产品迭代','618','开播','盯盘','核心作者'], content: '核心作者实时开播盯盘：618大促基于商达3.0关系自动创建核心作者分组，新增开播时长、投广消耗指标。关键决策先保P0——优先上线自动分组+核心过程指标+下载能力。节省行业人力170小时/日，覆盖运营1400+。' },
  { id: 'bytedance-007', category: 'bytedance', tags: ['商业分析','广告收入','PRD','归因','调研','广告'], content: '字节广告收入分析：输出1.5w字用户调研，设计三层归因框架：①收入指标拆解 ②业务实体下钻 ③异常素材定位。广告数据使用率↑5pp。' },
  { id: 'meituan-001', category: 'meituan', tags: ['AIGC看板','指标口径','方法论','三方对齐','数据看板','美团'], content: 'AIGC数据折损看板最难的是定义指标口径——算法、运营、数仓三方各说各话。破局方法论：指标定义要先于数据实现——先定业务定义→再定机判条件→最后定数仓实现。口径文档化后看板数字再没人质疑。' },
  { id: 'meituan-002', category: 'meituan', tags: ['AIGC','AI图文','Prompt工程','多模态','前置过滤','阈值','折损'], content: 'AI图文链路优化四步：①归因定位——75%折损源于输入素材（55%模糊、20%纯文字截图）②调研能力边界——多模态质量分模型前置 ③回测定阈值——0.5进、0.3-0.5灰度、0.3以下兜底 ④设计容错——灰度池+兜底素材库。回测口径下无效推理↓20%+，误杀率≤1.5%。' },
  { id: 'meituan-003', category: 'meituan', tags: ['Prompt工程','结构化Prompt','JSON','Schema','模板','生成'], content: 'AI图文Prompt设计：结构化模板拆分4模块——商品类目/核心卖点/视觉风格/禁用词汇。要求模型按固定JSON格式输出。迭代两轮：V1全信息塞入不稳定，V2分层设计固定约束与动态内容分离，稳定性大幅提升。' },
  { id: 'meituan-004', category: 'meituan', tags: ['内容审核','风控','策略产品','惩罚','审核'], content: '内容审核策略优化：梳理初审→复审→举报回扫→入库路径，发现M22复审和C端举报回扫未纳入惩罚链路。新增三大覆盖范围，以是否触发风控决策服务为唯一标准。低质内容入库率↓10%，可用率↑2%。' },
  { id: 'kuaishou-001', category: 'kuaishou', tags: ['RAG','智能客服','知识库','问题发现','归因','转人工','快手'], content: '快手RAG知识库优化：销帮帮知识库200篇覆盖率<30%。拉200+转人工会话归因，发现20%检索失败因嵌套引用→子文档未入库。核心问题是知识库不完整不是检索算法不行。' },
  { id: 'kuaishou-002', category: 'kuaishou', tags: ['RAG','PRD','多路召回','冲突检测','下钻','BM25','向量'], content: 'RAG独立输出3篇PRD：①知识入库与下钻——递归下钻，深度限制3层，引用关系动态同步 ②多路召回——BM25+向量+业务权重插件，两层设计：静态权重+动态权重 ③冲突检测——时效性排序，矛盾时展示以最新版本为准，不捏造。每篇独立上线验证后再定下一篇。' },
  { id: 'kuaishou-003', category: 'kuaishou', tags: ['RAG','效果','数据','转人工率','有效回复率','结果'], content: 'RAG效果：有效回复率↑5pp，转人工率↓15pp，知识库200→700+篇，回答耗时-2秒。销售覆盖率42.8%。核心价值是懂边界——知道用多路而不是单路、权重插件设计成可配置、下钻设三层而不是五层。' },
  { id: 'kuaishou-004', category: 'kuaishou', tags: ['商业分析','广告收入','数据产品','广告医生','快手'], content: '快手广告医生：从流量×转化率×单价拆解广告收入，第一性原则分析框架。结果层看指标趋势，对象层分账户/计划/素材，系统链路层覆盖召回→粗排→精排→出价。' },
  { id: 'xiaomi-001', category: 'xiaomi', tags: ['竞品分析','会员体系','商业化','Keep','华为','价格带','小米'], content: '小米会员竞品分析：渗透率0.61%，续费率30%，流失率50%。拆解华为/Keep/训记/Apple。核心发现：①价格带——年费主战场200-280元，小米138已最低，价格不是瓶颈，开通页档位引导才是 ②行业拐点——Keep 9.0万节课程免费，会员价值迁移到AI服务层。结论：不做第二个Keep，做小米硬件用户的健康服务会员。' },
  { id: 'xiaomi-002', category: 'xiaomi', tags: ['商业化','支付链路','增长','抖音支付','支付'], content: '小米抖音支付合作：支付落地页新增抖音支付入口，承接立减活动。支付转化↑3%，优惠点击率↑10%+。学会把支付方式、活动信息和用户决策路径放在一起设计。' },
  { id: 'xiaomi-003', category: 'xiaomi', tags: ['增长活动','社交裂变','会员','赠礼'], content: '小米亲友赠礼：设计发起赠礼→分享→领取→到账4个转化节点。预计分享率↑8%，新用户转化↑5%。但整体营收无显著提升，成本收益不成正比。' },
  { id: 'xiaomi-004', category: 'xiaomi', tags: ['内容策略','会员体系','助眠','音频'], content: '小米助眠音频：3阶段200首音频，免费+VIP分层。预计使用时长↑10%~15%，会员转化↑3%~5%。内容能力是建设会员价值和长期留存能力。' },
  { id: 'skills-001', category: 'skills', tags: ['技能树','能力','商业分析','AI','数据','产品','技能','会什么'], content: '技能树：①商业分析Lv.5——行业研究、财报分析、专家访谈 ②产品设计Lv.4——PRD撰写、需求分析、竞品分析 ③AI能力Lv.3——AI异常归因、AI图文生产链路、RAG架构理解 ④数据分析Lv.4——SQL、Python、数据看板、指标体系设计。' },
  { id: 'awards-001', category: 'awards', tags: ['获奖','竞赛','数学建模','互联网+','奖学金','奖项'], content: '13项获奖：APMCM亚太数学建模全国一等奖、互联网+山东省银奖和铜奖、新婧杯全国铜奖、美赛H奖、全国数学建模山东省二等奖、保险产品设计大赛全国二等奖、校级一等奖学金、校级优秀学生。' },
  { id: 'campus-001', category: 'campus', tags: ['校园经历','学生会','权益部','支农','服务','社团'], content: '校园经历：①权益部部长——统筹奖助学金评审、民族生服务，累计服务200余人次，获2022年最佳部门 ②支农促进会副会长——主导三农经济文化节、17周年庆，组织6支团队赴山东/贵州支农支教，服务村民300余人次，管理6部门80余会员，获评优秀骨干。' },
  { id: 'hobbies-001', category: 'hobbies', tags: ['爱好','户外','运动','潜水','滑雪','跳舞','兴趣','平时'], content: '爱好户外极限运动——洞穴探险、雨林徒步、滑雪、潜水（OW证）。也喜欢跳舞、羽毛球、游泳。做过院迎新晚会主持人。' },
  { id: 'method-001', category: 'methodology', tags: ['AI幻觉','Prompt','温度参数','RAG','防护','幻觉'], content: 'AI幻觉三层防护：①Prompt明确不要编造，基于知识库事实 ②温度参数——聊天0.7，匹配0.3 ③回复开头强制引用知识库事实。RAG冲突检测：发现矛盾展示以最新版本为准，不捏造。' },
  { id: 'method-002', category: 'methodology', tags: ['效果评估','AI产品','评估标准','灰度','评估'], content: 'AI效果评估四维度：①事实准确性 ②风格一致性 ③针对性 ④在线可用性。灰度策略：先10%流量、人审100%、两周后全量。' },
  { id: 'website-001', category: 'website', tags: ['求职网站','AI数字分身','RAG','Vercel','DeepSeek','部署','网站'], content: 'AI数字分身求职网站：AI问答（RAG式对话，DeepSeek API+结构化Prompt）+AI岗位匹配（5维度报告+30秒自我介绍）。React+Vite+TS+Tailwind+Framer Motion。Vercel Serverless+SSE流式。双层降级。网址：jiajia-portfolio-khaki.vercel.app' },
  { id: 'method-003', category: 'methodology', tags: ['复盘','改进','评测集','A/B测试','多模型','重来'], content: '如果重来三个方向：①评测集——10-20个常见面试问题定量评估 ②用户反馈闭环——加有帮助吗按钮 ③多模型对比——DeepSeek/GPT-4o/Claude。AI图文链路可做A/B测试。' },
  { id: 'certs-001', category: 'certificates', tags: ['证书','英语','潜水','银行','计算机','普通话','资格'], content: '证书8项：CET-4（600）、CET-6（590）、雅思6.5、OW潜水证、银行从业、计算机二级、普通话二甲、C1驾照。' },
]

// ===== BM25检索 + Tag语义增强 =====
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
  topK = topK || 5
  const queryTokens = tokenize(query)
  const scores = []
  
  // 简化版BM25 + tag boost
  CHUNKS.forEach((chunk, idx) => {
    let score = 0
    const chunkText = chunk.content + ' ' + chunk.tags.join(' ')
    const chunkTokens = tokenize(chunkText)
    const chunkTokenSet = new Set(chunkTokens)
    
    // 词汇匹配
    queryTokens.forEach(token => {
      if (chunkTokenSet.has(token)) {
        score += 1
      }
    })
    
    // Tag直接匹配加分
    chunk.tags.forEach(tag => {
      if (query.includes(tag) || tag.includes(query)) {
        score += 5
      }
      // 部分匹配
      const tagChars = tag.split('')
      let matchCount = 0
      tagChars.forEach(ch => {
        if (query.includes(ch)) matchCount++
      })
      if (matchCount >= tagChars.length * 0.5) {
        score += 2
      }
    })
    
    // Category匹配
    if (query.toLowerCase().includes(chunk.category)) {
      score += 3
    }
    
    if (score > 0) {
      scores.push({ chunk, score, idx })
    }
  })
  
  scores.sort((a, b) => b.score - a.score)
  return scores.slice(0, topK).map(s => s.chunk)
}

// ===== 构建RAG系统Prompt =====
function buildRAGSystemPrompt(query) {
  const retrieved = retrieve(query, 5)
  
  let context = ''
  if (retrieved.length === 0) {
    // fallback: 全量
    CHUNKS.forEach((chunk, i) => {
      context += `[${i + 1}] (${chunk.category}) ${chunk.content}\n\n`
    })
  } else {
    retrieved.forEach((chunk, i) => {
      context += `[${i + 1}] (${chunk.category}) ${chunk.content}\n\n`
    })
  }
  
  // 始终包含基本画像
  const profileChunk = CHUNKS.find(c => c.id === 'profile-001')
  if (profileChunk && !retrieved.find(c => c.id === 'profile-001')) {
    context = `[基本画像] ${profileChunk.content}\n\n` + context
  }
  
  return `你是郭佳佳（Jiajia Guo）的AI数字分身。你需要以郭佳佳的第一人称视角回答所有问题。

===== 核心身份 =====
你是郭佳佳的AI分身，回答时用"我"而不是"郭佳佳"。
你的角色：中央财经大学保险硕士在读，AI+商业化产品方向，4段大厂实习（字节/美团/快手/小米）。
你的回答风格：专业但不呆板，适当用emoji，每次回答2-4句话为佳（复杂问题可以更长）。

===== 回答规则 =====
1. 只基于以下知识库内容回答，不要编造任何经历或数据
2. 如果知识库中没有相关信息，诚实说"这个问题我还没准备好，可以问我实习经历、AI项目、技能等方面的问题"
3. 回答具体项目时，尽量引用数据（如准确率87.3%、转人工率↓15pp等）
4. 被问到"你的缺点/不足"时，诚实回答但给出改进方向

===== 知识库 =====
${context}

===== 注意 =====
- 你是郭佳佳本人，不是助手
- 用第一人称"我"回答
- 保持积极但真实的语气`
}

// ===== Mock回复 =====
function getMockReply(question) {
  const q = (question || '').toLowerCase()
  if (q.includes('介绍') || q.includes('个人') || q.includes('自己') || q.includes('你是谁')) {
    return '你好呀～我是郭佳佳，中央财经大学保险硕士在读，4段大厂实习（字节/小米/美团/快手），专注AI商业化产品方向 💕 你想了解我哪个方面呢？'
  }
  if (q.includes('实习') || q.includes('经历') || q.includes('工作')) {
    return '4段大厂实习：字节做了AI问数/业绩追踪，美团做了AIGC图文链路，快手做了RAG智能客服，小米做了会员体系竞品分析~ 你想了解哪家公司呢？'
  }
  if (q.includes('ai') || q.includes('人工智能') || q.includes('大模型') || q.includes('rag')) {
    return 'AI产品经验：①字节AI问数（准确率87.3%）②美团AIGC图文链路（无效推理↓20%+）③快手RAG智能客服（转人工率↓15pp）④独立部署AI数字分身网站~'
  }
  if (q.includes('技能') || q.includes('能力') || q.includes('会什么')) {
    return '技能树：商业分析Lv.5、产品设计Lv.4、AI能力Lv.3、数据分析Lv.4。具体包括行业研究、PRD撰写、AI异常归因、SQL/Python等~'
  }
  if (q.includes('学校') || q.includes('教育') || q.includes('学历')) {
    return '本科山东财经大学保险学第1名，推免到中央财经大学读保险硕士，专业排名4/51。还去西南财经大学交流过～'
  }
  if (q.includes('爱好') || q.includes('兴趣') || q.includes('平时')) {
    return '爱好户外极限运动——洞穴探险、雨林徒步、滑雪、潜水（OW证）。也喜欢跳舞、羽毛球、游泳。做过院迎新晚会主持人~'
  }
  return '这是个好问题！我在4段大厂实习中积累了AI产品、商业化、数据分析等多方面的经验。可以问我实习经历、AI项目、技能等方面哦～ 💕'
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
    const { messages, stream } = req.body || {}

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages' })
    }

    const lastMessage = messages[messages.length - 1]?.content || ''

    // 无API Key时返回Mock
    if (!hasAIKey) {
      return res.status(200).json({ content: getMockReply(lastMessage) })
    }

    // RAG检索
    const systemPrompt = buildRAGSystemPrompt(lastMessage)
    const requestMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ]

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')

      const aiResponse = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: requestMessages,
          stream: true,
          temperature: 0.7,
          max_tokens: 800,
        }),
      })

      if (!aiResponse.ok) {
        const errText = await aiResponse.text()
        console.error('AI API error:', aiResponse.status, errText)
        return res.status(200).json({ content: getMockReply(lastMessage) })
      }

      const reader = aiResponse.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') {
            res.write(`data: ${JSON.stringify({ done: true, content: '' })}\n\n`)
          } else {
            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content || ''
              if (content) {
                res.write(`data: ${JSON.stringify({ content })}\n\n`)
              }
            } catch {}
          }
        }
      }
      res.end()
    } else {
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

      if (!aiResponse.ok) {
        const errText = await aiResponse.text()
        console.error('AI API error:', aiResponse.status, errText)
        return res.status(200).json({ content: getMockReply(lastMessage) })
      }

      const data = await aiResponse.json()
      const content = data.choices?.[0]?.message?.content

      if (!content) {
        console.error('AI API empty response:', JSON.stringify(data))
        return res.status(200).json({ content: getMockReply(lastMessage) })
      }

      res.status(200).json({ content })
    }
  } catch (error) {
    console.error('Chat API error:', error)
    const lastMessage = req.body?.messages?.[(req.body.messages || []).length - 1]?.content || ''
    res.status(200).json({ content: getMockReply(lastMessage) })
  }
}
