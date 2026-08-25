// AI服务核心逻辑 - 被Express和Vercel Functions共享

import { buildSystemPrompt, buildMatchSystemPrompt } from './knowledge'
import { knowledgeData } from './knowledgeData'

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

const API_KEY = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || ''
const BASE_URL = process.env.AI_BASE_URL || 'https://api.deepseek.com/v1'
const MODEL = process.env.AI_MODEL || 'deepseek-chat'

const hasAIKey = !!API_KEY

// 聊天接口
export async function chat(
  messages: ChatMessage[],
  stream: boolean = false,
  onStream?: (chunk: string) => void
): Promise<string> {
  if (!hasAIKey) {
    return getMockReply(messages[messages.length - 1]?.content || '')
  }

  const systemPrompt = buildSystemPrompt(knowledgeData)

  const requestMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ]

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: requestMessages,
        stream,
        temperature: 0.7,
        max_tokens: 800,
      }),
    })

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`)
    }

    if (stream && response.body) {
      // 流式响应处理
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              if (onStream) onStream('')
              return fullText
            }
            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content
              if (content) {
                fullText += content
                if (onStream) onStream(content)
              }
            } catch {
              // 忽略格式错误
            }
          }
        }
      }
      return fullText
    } else {
      // 非流式响应
      const data = await response.json()
      return data.choices?.[0]?.message?.content || '抱歉，我暂时无法回答这个问题。'
    }
  } catch (error) {
    console.error('AI chat error:', error)
    return getMockReply(messages[messages.length - 1]?.content || '')
  }
}

// 岗位匹配接口
export async function matchJob(jd: string, position: string): Promise<MatchResult> {
  if (!hasAIKey) {
    return getMockMatchResult(position)
  }

  const systemPrompt = buildMatchSystemPrompt(knowledgeData)
  const userPrompt = `目标岗位：${position}

岗位描述（JD）：
${jd}

请根据以上岗位描述，评估郭佳佳与该岗位的匹配度，输出严格的JSON格式结果。`

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
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

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (content) {
      try {
        const result = JSON.parse(content)
        return validateMatchResult(result, position)
      } catch {
        return getMockMatchResult(position)
      }
    }

    return getMockMatchResult(position)
  } catch (error) {
    console.error('AI match error:', error)
    return getMockMatchResult(position)
  }
}

function validateMatchResult(result: any, position: string): MatchResult {
  return {
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
}

// Mock回复
function getMockReply(question: string): string {
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

// Mock匹配结果
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
