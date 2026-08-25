import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react'
import type { ChatMessage } from '@/types'
import { mockStarterQuestions } from '@/data/mockData'
import { chatWithAI } from '@/lib/ai/apiClient'

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'ai',
      content: '你好呀～我是佳佳的AI分身 💕 有什么想了解的吗？',
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
  }, [messages, isTyping, isOpen])

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

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-pink text-white shadow-lg hover:scale-110 transition-all z-50 flex items-center justify-center hover:shadow-xl"
      >
        <Sparkles className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 glass rounded-t-2xl rounded-b-3xl shadow-card transition-all duration-300 ${
        isMinimized ? 'w-72 h-14' : 'w-96 h-[500px]'
      }`}
    >
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-border-pink-light shrink-0 cursor-pointer" onClick={() => isMinimized && setIsMinimized(false)}>
        <div className="flex items-center gap-2">
          <img
            src="/assets/ip-character.png"
            alt="AI Jiajia"
            className="w-7 h-7 rounded-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <div>
            <span className="text-sm-md font-semibold text-text-primary">AI Jiajia</span>
            <div className="flex items-center gap-1">
              <div className="status-dot" style={{ width: '6px', height: '6px' }} />
              <span className="text-xs text-text-tertiary">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized) }}
            className="p-1.5 text-text-tertiary hover:text-pink-primary transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIsOpen(false) }}
            className="p-1.5 text-text-tertiary hover:text-pink-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ height: 'calc(100% - 130px)' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'ai' && (
                  <img
                    src="/assets/ip-character.png"
                    alt="AI"
                    className="w-6 h-6 rounded-full shrink-0 mt-0.5 object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 ${
                    msg.role === 'ai'
                      ? 'rounded-xl-xl rounded-bl-sm bg-card-bg-pink-light text-text-primary'
                      : 'rounded-xl-xl rounded-br-sm bg-gradient-pink text-white'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 items-center">
                <img
                  src="/assets/ip-character.png"
                  alt="AI"
                  className="w-6 h-6 rounded-full shrink-0 object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                <div className="px-3 py-2 rounded-xl-xl rounded-bl-sm bg-card-bg-pink-light">
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

          {/* Quick questions */}
          <div className="px-4 pb-1 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {mockStarterQuestions.slice(0, 3).map((q) => (
              <button
                key={q.id}
                onClick={() => handleSend(q.prompt)}
                disabled={isTyping}
                className="shrink-0 px-3 py-1 rounded-xl-lg bg-card-bg border border-border-pink-light text-xs text-text-secondary hover:bg-pink-light/20 hover:border-pink-active transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {q.title}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 pt-2 shrink-0">
            <div className="flex items-center gap-2 h-10 px-4 rounded-xl-xl bg-card-bg-pink border border-border-pink-light focus-within:border-pink-active transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="问佳佳任何问题..."
                disabled={isTyping}
                className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-faint disabled:opacity-50"
              />
              <button
                onClick={() => handleSend()}
                disabled={isTyping || !input.trim()}
                className="text-pink-primary hover:scale-110 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
