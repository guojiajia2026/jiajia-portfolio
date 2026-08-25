// AI API 客户端 - 前端调用后端接口

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface MatchResult {
  score: number
  position: string
  level: string
  summary: string
  matches: Array<{
    requirement: string
    stars: number
    evidence: string
  }>
  gaps: string[]
  highlights: string[]
  recommendations: string[]
  elevatorPitch: string
}

const API_BASE = '/api'

// AI聊天接口
export async function chatWithAI(
  messages: ChatMessage[],
  onStream?: (chunk: string) => void
): Promise<string> {
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, stream: !!onStream }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    // 流式响应
    if (onStream && response.body) {
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        // 处理SSE格式: data: {...}
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.content) {
                fullText += data.content
                onStream(data.content)
              }
              if (data.done) {
                return fullText
              }
            } catch {
              // 忽略格式错误的行
            }
          }
        }
      }
      return fullText
    }

    // 非流式响应
    const data = await response.json()
    return data.content || data.reply || '抱歉，我暂时无法回答这个问题。'
  } catch (error) {
    console.error('Chat API error:', error)
    // Fallback to mock response
    return getMockReply()
  }
}

// 岗位匹配接口
export async function matchJob(
  jd: string,
  position: string
): Promise<MatchResult | null> {
  try {
    const response = await fetch(`${API_BASE}/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jd, position }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data as MatchResult
  } catch (error) {
    console.error('Match API error:', error)
    // Fallback to mock result
    return getMockMatchResult(position)
  }
}

// Mock回复（API不可用时的降级方案）
function getMockReply(): string {
  const replies = [
    '关于这个问题，我可以从我的经历来回答～我在4段大厂实习中积累了AI产品、商业化、数据分析等多方面的经验。你想了解具体哪个方面呢？💕',
    '这是个好问题！我从金融研究出发，逐步探索到AI产品方向。我的核心优势是商业分析能力+AI产品经验的结合，具体可以参考我在字节和美团的AI项目经历~',
    '我来分享一下我的看法～我认为AI产品经理最重要的是理解业务痛点，然后用AI技术创造性地解决问题。我在快手做的RAG智能客服项目就是一个很好的例子！',
    '谢谢你的提问！关于这个话题，我在实习中有一些实战经验。比如在字节跳动做的AI业绩追踪项目，让我对AI产品从0到1的落地有了很深的理解。你还想了解什么呢？',
  ]
  return replies[Math.floor(Math.random() * replies.length)]
}

// Mock匹配结果（API不可用时的降级方案）
function getMockMatchResult(position: string): MatchResult {
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
      '学习能力强，专业排名第1，多次获奖',
    ],
    recommendations: [
      '补充Agent开发相关的项目经验',
      '学习模型评估指标和方法',
      '积累更多to C产品视角',
    ],
    elevatorPitch: `你好，我是郭佳佳，中央财经大学保险硕士，有4段大厂实习经历，专注AI商业化产品方向。我在字节做过AI业绩追踪产品，在美团做过AIGC图文生产链路优化，在快手做过RAG智能客服知识库，既有AI产品落地经验，也有商业分析和数据产品的复合能力。我相信我的背景能为${position}岗位带来独特的价值！`,
  }
}
