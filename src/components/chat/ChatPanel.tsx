import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Trash2, ArrowRight } from 'lucide-react'
import type { ChatMessage } from '@/types'
import { mockStarterQuestions } from '@/data/mockData'
import { chatWithAI } from '@/lib/ai/apiClient'

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'ai',
      content: '你好，我是佳佳的AI数字分身 💕 有什么想了解的吗？',
      timestamp: Date.now(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = async (text?: string) => {
    const content = text || input.trim()
    if (!content || isTyping) return

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // 准备历史消息（只传最近10条，节省token）
    const history = messages.slice(-10).map(m => ({
      role: m.role === 'ai' ? 'assistant' as const : 'user' as const,
      content: m.content,
    }))
    history.push({ role: 'user', content })

    try {
      const aiContent = await chatWithAI(history)
      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'ai',
        content: aiContent,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [...prev, {
        id: `a-${Date.now()}`,
        role: 'ai',
        content: '抱歉，我暂时无法回答这个问题，请稍后再试～',
        timestamp: Date.now(),
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const clearChat = () => {
    setMessages([{
      id: 'm1',
      role: 'ai',
      content: '你好，我是佳佳的AI数字分身 💕 有什么想了解的吗？',
      timestamp: Date.now(),
    }])
  }

  return (
    <div className="glass rounded-xl-3xl h-full flex flex-col overflow-hidden shadow-card">
      {/* Header */}
      <div className="h-14 px-5 flex items-center justify-between border-b border-border-pink-light shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2">
            <div className="status-dot" />
            <span className="text-base-md font-semibold text-text-primary">
              AI Jiajia Online
            </span>
          </div>
          <span className="text-xs-sm text-text-tertiary hidden tablet:inline">
            Knowledge Base Connected
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-xl-sm bg-pink-primary/15 text-xs-sm text-pink-primary flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Knowledge
          </div>
          <button
            onClick={clearChat}
            className="text-text-tertiary hover:text-pink-primary transition-colors"
            title="清空对话"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'ai' && (
              <img
                src="/assets/ip-character.png"
                alt="AI"
                className="w-8 h-8 rounded-full shrink-0 mt-0.5 object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            )}
            <div
              className={`max-w-[80%] px-4 py-3 ${
                msg.role === 'ai'
                  ? 'rounded-xl-xl rounded-bl-sm bg-card-bg-pink-light text-text-primary'
                  : 'max-w-[70%] rounded-xl-xl rounded-br-sm bg-gradient-pink text-white'
              }`}
            >
              <p className="text-base-md leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              {msg.cards && msg.cards.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.cards.map((card, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl-lg bg-card-bg-white border border-border-pink-light"
                    >
                      <p className="text-xs-sm text-text-tertiary mb-1.5 font-medium">
                        {card.title}
                      </p>
                      {card.content && (
                        <p className="text-base-md text-text-primary mb-2">
                          {card.content}
                        </p>
                      )}
                      {card.tags && (
                        <div className="flex flex-wrap gap-1.5">
                          {card.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs-sm text-pink-primary px-2.5 py-1 rounded-lg bg-pink-primary/10 flex items-center gap-1"
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <button className="flex items-center gap-1 text-xs-sm text-pink-primary hover:gap-2 transition-all">
                    Explore More <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2 items-center">
            <img
              src="/assets/ip-character.png"
              alt="AI"
              className="w-8 h-8 rounded-full shrink-0 object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            <div className="px-4 py-3 rounded-xl-xl rounded-bl-sm bg-card-bg-pink-light">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-pink-primary/60"
                    style={{
                      animation: `pulse-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Starter Cards */}
      <div className="px-5 pb-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
        {mockStarterQuestions.map((q) => (
          <button
            key={q.id}
            onClick={() => handleSend(q.prompt)}
            disabled={isTyping}
            className="shrink-0 px-5 py-2 rounded-xl-2xl bg-card-bg border border-border-pink-light text-sm-md text-text-secondary hover:bg-pink-light/20 hover:border-pink-active transition-all duration-250 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {q.title}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-5 pt-3 shrink-0">
        <div className="flex items-center gap-2 h-12 px-5 rounded-xl-xl bg-card-bg-pink border border-border-pink-light focus-within:border-pink-active transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="问佳佳任何问题..."
            disabled={isTyping}
            className="flex-1 bg-transparent outline-none text-base-md text-text-primary placeholder:text-text-faint disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={isTyping || !input.trim()}
            className="text-pink-primary hover:scale-110 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs-sm text-text-faint mt-2 text-center">
          AI 回答基于佳佳的个人知识库 · 内容仅供参考
        </p>
      </div>
    </div>
  )
}
