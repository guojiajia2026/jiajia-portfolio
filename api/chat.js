// Vercel Serverless Function - AI聊天接口 (RAG增强版)
import { buildRAGSystemPrompt, retrieve } from '../server/retrieval.js'

const API_KEY = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || ''
const BASE_URL = process.env.AI_BASE_URL || 'https://api.deepseek.com/v1'
const MODEL = process.env.AI_MODEL || 'deepseek-chat'

const hasAIKey = !!API_KEY

function getMockReply(question) {
  const q = question.toLowerCase()
  if (q.includes('介绍') || q.includes('个人') || q.includes('自己')) {
    return '你好呀～我是郭佳佳，中央财经大学保险硕士在读，目前有4段大厂实习经历（字节、小米、美团、快手），专注AI商业化产品方向。我从金融研究出发，逐步探索到AI产品，希望成为连接业务、用户和技术的AI产品经理 💕 你想了解我哪个方面呢？'
  }
  if (q.includes('实习') || q.includes('经历') || q.includes('工作')) {
    return '我一共有4段大厂实习经历哦！最近的是在字节跳动做数据产品实习生，做了AI问数和广告收入分析的项目。之前还在美团做AIGC策略产品、小米做商业化产品、快手做数据产品。每一段经历都让我对AI产品有了更深的理解~ 你想了解哪家公司的经历呢？'
  }
  if (q.includes('ai') || q.includes('人工智能') || q.includes('大模型')) {
    return '我的AI产品经验主要来自3个项目：1）字节的AI业绩追踪——从0到1搭建AI解读+业绩报告能力；2）美团的AIGC图文生产链路优化——回测口径下无效推理下降20%+；3）快手的RAG智能客服——知识库从200篇扩展到700+篇，转人工率下降15pp。这些项目让我积累了AI产品从需求定义到落地迭代的全链路经验~'
  }
  if (q.includes('技能') || q.includes('能力') || q.includes('会什么')) {
    return '我的核心技能包括：📊商业分析（Lv.5）——行业研究、财报分析、第一性原则拆解；📱产品设计（Lv.4）——PRD撰写、需求分析、用户调研；🤖AI能力（Lv.3）——AI异常归因、AIGC链路、RAG架构；📈数据分析（Lv.4）——SQL、Python、看板搭建。另外英语也不错哦，雅思6.5分~'
  }
  if (q.includes('学校') || q.includes('教育') || q.includes('学历')) {
    return '我现在是中央财经大学保险硕士在读，专业排名4/51。本科是山东财经大学保险学，专业排名第1，后来推免到了央财。还去西南财经大学交流过一个学期～虽然学的是保险，但我对产品和AI更感兴趣，所以一直在往这个方向探索✨'
  }
  if (q.includes('爱好') || q.includes('兴趣') || q.includes('平时')) {
    return '我是个户外活动爱好者！🦇洞穴探险、🌿雨林徒步、⛷️滑雪、🤿潜水（有OW证哦），都很喜欢！我觉得户外探索和做产品很像，都是在未知中寻找答案的过程～另外我还喜欢跳舞、羽毛球、游泳，也做过院迎新晚会主持人呢！'
  }
  return '这是个好问题！我在4段大厂实习中积累了AI产品、商业化、数据分析等多方面的经验。如果你想了解具体某个方向，比如我的AI项目经历、商业化思考或者数据分析能力，都可以告诉我哦～ 💕'
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
    const { messages, stream } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages' })
    }

    const lastMessage = messages[messages.length - 1]?.content || ''

    if (!hasAIKey) {
      const reply = getMockReply(lastMessage)
      return res.status(200).json({ content: reply })
    }

    // RAG: 根据用户问题检索相关知识块，构建精准上下文
    const systemPrompt = buildRAGSystemPrompt(lastMessage)

    const requestMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ]

    if (stream) {
      // 流式输出
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
      // 非流式
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
    }
  } catch (error) {
    console.error('Chat API error:', error)
    
    // 出错时返回mock回复
    const lastMessage = req.body?.messages?.[req.body.messages.length - 1]?.content || ''
    const reply = getMockReply(lastMessage)
    res.status(200).json({ content: reply })
  }
}
