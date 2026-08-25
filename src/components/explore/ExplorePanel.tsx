import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Rocket, Star, X, Send, Loader2, RotateCcw, FileText,
  Target, Zap, Brain, BarChart3, Layers, ArrowRight, Compass, Edit3,
  CheckCircle, AlertCircle,
} from 'lucide-react'
import { mockProductCases } from '@/data/mockData'
import type { ProductCase, MatchResult } from '@/types'
import { ProductDetail } from '@/components/explore/ProductDetail'
import { SparkleStar } from '@/components/decorations/Y2KDecorations'
import { matchJob } from '@/lib/ai/apiClient'

type MatchStep = 'idle' | 'input' | 'loading' | 'result'

export function ExplorePanel() {
  const [matchStep, setMatchStep] = useState<MatchStep>('idle')
  const [jdInput, setJdInput] = useState('')
  const [selectedPosition, setSelectedPosition] = useState<string>('')
  const [customPosition, setCustomPosition] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<ProductCase | null>(null)
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)

  const positions = ['AI PM', '商业化PM', '数据PM', '其他']

  const startMatch = async () => {
    const position = isOtherSelected ? customPosition.trim() : selectedPosition
    if (!jdInput.trim() || !position) return

    setMatchStep('loading')
    setMatchResult(null)

    try {
      const result = await matchJob(jdInput.trim(), position)
      if (result) {
        setMatchResult(result)
        setMatchStep('result')
      } else {
        setMatchStep('input')
      }
    } catch (error) {
      console.error('Match error:', error)
      setMatchStep('input')
    }
  }

  const openProduct = (product: ProductCase) => {
    setSelectedProduct(product)
  }

  const isOtherSelected = selectedPosition === '其他'

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'from-pink-primary to-pink-purple'
    if (score >= 70) return 'from-pink-light to-pink-primary'
    if (score >= 55) return 'from-pink-light/80 to-pink-light'
    return 'from-text-faint to-text-tertiary'
  }

  const getLevelColor = (level: string) => {
    if (level === '高度匹配') return 'text-green-500'
    if (level === '较为匹配') return 'text-pink-primary'
    if (level === '部分匹配') return 'text-amber-500'
    return 'text-text-tertiary'
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
      {/* ===== AI岗位匹配 ===== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-white rounded-xl-3xl p-6 shadow-card"
      >
        <div className="flex items-center gap-2 mb-5">
          <div className="w-10 h-10 rounded-xl-md bg-gradient-pink flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl-2xl font-bold text-text-primary">AI岗位匹配</h3>
            <p className="text-xs-sm text-text-faint">AI Career Match</p>
          </div>
          <SparkleStar size={16} className="ml-auto" delay={0.3} />
        </div>

        <div className="grid grid-cols-1 desktop:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-sm-md text-text-secondary leading-relaxed">
              输入目标岗位的JD，AI将分析你的能力匹配度，生成详细的能力对照表和成长建议。
            </p>
            <button
              onClick={() => setMatchStep('input')}
              className="mt-4 px-8 py-2.5 rounded-xl-2xl bg-gradient-pink text-white font-semibold text-base-md hover:scale-105 active:scale-95 transition-transform duration-250 shadow-card flex items-center gap-2"
            >
              <Rocket className="w-4 h-4" /> 开始匹配
            </button>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative w-44 h-44">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {[0.4, 0.7, 1].map((scale, i) => {
                  const points = [
                    [100, 100 + (10 - 80) * scale],
                    [100 + 73 * scale, 100 + 27 * scale * 0.7],
                    [100 + 48 * scale, 100 + 65 * scale],
                    [100 - 48 * scale, 100 + 65 * scale],
                    [100 - 73 * scale, 100 + 27 * scale * 0.7],
                  ]
                  return <polygon key={i} points={points.map((p) => p.join(',')).join(' ')} fill="none" stroke="rgba(255,182,193,0.3)" strokeWidth="1" />
                })}
                <polygon points="100,35 160,82 138,152 62,152 45,82" fill="rgba(255,182,193,0.15)" stroke="#FFB6C1" strokeWidth="2" />
                {[
                  { x: 100, y: 35 }, { x: 160, y: 82 }, { x: 138, y: 152 }, { x: 62, y: 152 }, { x: 45, y: 82 },
                ].map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#FF8E9E" />)}
              </svg>
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full text-xs-sm text-text-tertiary font-medium">AI</span>
              <span className="absolute top-1/4 right-0 translate-x-full text-xs-sm text-text-tertiary font-medium">产品</span>
              <span className="absolute bottom-2 right-2 translate-x-1/4 text-xs-sm text-text-tertiary font-medium">数据</span>
              <span className="absolute bottom-2 left-2 -translate-x-1/4 text-xs-sm text-text-tertiary font-medium">商业</span>
              <span className="absolute top-1/4 left-0 -translate-x-full text-xs-sm text-text-tertiary font-medium">技术</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== 产品案例馆 ===== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass rounded-xl-3xl p-6 shadow-card"
      >
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-xl-md bg-gradient-to-br from-pink-primary to-pink-purple flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xl-2xl font-bold text-text-primary">产品案例馆</h3>
            <p className="text-xs-sm text-text-faint">Product Museum</p>
          </div>
          <span className="text-xs-sm text-text-faint ml-auto">点击查看详情 →</span>
        </div>

        <div className="grid grid-cols-1 desktop:grid-cols-3 gap-4">
          {mockProductCases.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => openProduct(product)}
              className="rounded-xl-lg overflow-hidden bg-card-bg border border-border-pink-light hover:border-pink-active transition-all hover:shadow-card group cursor-pointer"
            >
              <div className="h-16 bg-gradient-to-br from-pink-light/30 via-pink-primary/20 to-pink-purple/20 flex items-center justify-center">
                <span className="text-2xl">{product.icon}</span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm-md font-bold text-text-primary truncate">{product.name}</p>
                    <p className="text-xs-sm text-text-faint">{product.company}</p>
                  </div>
                  <div className="flex gap-0.5 shrink-0 ml-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < product.stars ? 'text-pink-primary fill-pink-light' : 'text-text-faint/30'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-xs-sm text-pink-primary px-2 py-0.5 rounded bg-pink-primary/10 font-medium">{product.tag}</span>
                </div>
                <p className="text-xs-sm text-text-tertiary leading-relaxed line-clamp-2">{product.desc}</p>
                <div className="flex items-center gap-1 text-xs-sm text-pink-primary mt-3 group-hover:gap-2 transition-all">
                  查看详情 <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ===== 成长旅程 ===== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass rounded-xl-3xl p-6 shadow-card"
      >
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-xl-md bg-gradient-to-br from-pink-purple to-pink-light flex items-center justify-center">
            <Compass className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xl-2xl font-bold text-text-primary">成长旅程</h3>
            <p className="text-xs-sm text-text-faint">Growth Journey</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-light via-pink-primary to-pink-purple" />
          <div className="grid grid-cols-3 gap-4 relative">
            {[
              { phase: 'Phase 0', title: '风险与商业观察者', year: '2023', icon: BarChart3, items: [{ text: '民生证券 · 行业研究', badge: '' }, { text: '华泰证券 · 用户运营', badge: '' }, { text: '国金证券 · 机构销售', badge: '' }], skill: '商业分析 ⭐⭐⭐⭐⭐', color: 'from-pink-light to-pink-primary' },
              { phase: 'Phase 1', title: '商业化产品探索者', year: '2024', icon: Zap, items: [{ text: '快手 · 智能客服产品', badge: '/assets/badge-kuaishou.jpg' }, { text: '小米 · 会员增长体系', badge: '/assets/badge-xiaomi.jpg' }], skill: 'B端产品设计 ⭐⭐⭐⭐⭐', color: 'from-pink-primary to-pink-purple' },
              { phase: 'Phase 2', title: 'AI时代产品探索者', year: '2025', icon: Brain, items: [{ text: '美团 · AI图文生产链路', badge: '/assets/badge-meituan.jpg' }, { text: '字节 · AI异常归因', badge: '/assets/badge-bytedance.jpg' }], skill: 'AI商业化分析 ⭐⭐⭐⭐⭐', color: 'from-pink-purple to-pink-light' },
            ].map((phase, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-card z-10 border-4 border-white group-hover:scale-110 transition-transform`}>
                  <phase.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs-sm text-pink-primary font-bold mt-2">{phase.phase}</span>
                <p className="text-base-md font-bold text-text-primary mt-1">{phase.title}</p>
                <p className="text-xs-sm text-text-faint">{phase.year}</p>
                <div className="mt-2 space-y-1">
                  {phase.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-1.5 justify-center">
                      {item.badge && (
                        <img
                          src={item.badge}
                          alt=""
                          className="w-4 h-4 rounded-full object-cover shrink-0"
                          onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                      )}
                      <p className="text-xs-sm text-text-tertiary">{item.text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 px-3 py-1 rounded-xl-sm bg-pink-light/12 text-xs-sm text-pink-primary font-medium">{phase.skill}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ===== 能力速览 ===== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="grid grid-cols-2 desktop:grid-cols-4 gap-3"
      >
        {[
          { icon: Brain, label: 'AI能力', value: 'Lv.3', items: ['AI归因', 'RAG架构', 'AI图文'] },
          { icon: Zap, label: '产品能力', value: 'Lv.4', items: ['PRD', '竞品分析', '用户调研'] },
          { icon: BarChart3, label: '数据能力', value: 'Lv.4', items: ['SQL', 'Python', '看板搭建'] },
          { icon: Target, label: '商业能力', value: 'Lv.5', items: ['行业研究', '财报分析', '商业洞察'] },
        ].map((cap, i) => (
          <div key={i} className="glass-white rounded-xl-lg p-4 shadow-card text-center hover:shadow-card-hover transition-shadow">
            <div className="w-10 h-10 rounded-xl-md bg-gradient-pink flex items-center justify-center mx-auto mb-2">
              <cap.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm-md font-bold text-text-primary">{cap.label}</p>
            <p className="text-xs-sm text-pink-primary font-bold mb-2">{cap.value}</p>
            <div className="space-y-0.5">
              {cap.items.map((item, j) => (
                <p key={j} className="text-xs-sm text-text-tertiary">{item}</p>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Career Match Modal */}
      <AnimatePresence>
        {matchStep !== 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => matchStep !== 'loading' && setMatchStep('idle')}
            className="fixed inset-0 z-[200] flex items-center justify-center px-4"
            style={{ background: 'rgba(60,40,50,0.6)', backdropFilter: 'blur(6px)' }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-modal rounded-xl-4xl shadow-card-hover w-[600px] max-w-full max-h-[85vh] overflow-y-auto"
            >
              {matchStep === 'input' && (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-md-lg font-bold text-text-primary flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-pink-primary" /> AI岗位匹配
                    </h3>
                    <button onClick={() => setMatchStep('idle')} className="text-text-tertiary hover:text-pink-primary transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <label className="text-sm-md text-text-secondary font-medium mb-2 block">请输入岗位描述（JD）：</label>
                  <textarea
                    value={jdInput}
                    onChange={(e) => setJdInput(e.target.value)}
                    placeholder="请粘贴完整的岗位描述，包括岗位职责、任职要求等..."
                    className="w-full h-[140px] p-4 rounded-xl-lg bg-card-bg-pink border border-border-pink-light text-base-md text-text-primary placeholder:text-text-faint outline-none focus:border-pink-active transition-colors resize-none"
                  />
                  <p className="text-sm-md text-text-secondary font-medium mt-4 mb-2">目标岗位：</p>
                  <div className="flex gap-2 flex-wrap">
                    {positions.map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setSelectedPosition(pos)}
                        className={`px-4 py-2 rounded-xl-md text-sm-md font-medium transition-all border flex items-center gap-1.5 ${
                          selectedPosition === pos ? 'bg-gradient-pink text-white border-transparent' : 'bg-card-bg text-text-secondary border-border-pink-light hover:border-pink-active'
                        }`}
                      >
                        {pos === '其他' && <Edit3 className="w-3 h-3" />}
                        {pos}
                      </button>
                    ))}
                  </div>
                  {isOtherSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3"
                    >
                      <input
                        type="text"
                        value={customPosition}
                        onChange={(e) => setCustomPosition(e.target.value)}
                        placeholder="请输入目标岗位名称..."
                        className="w-full px-4 py-2.5 rounded-xl-md bg-card-bg-pink border border-border-pink-light text-sm-md text-text-primary placeholder:text-text-faint outline-none focus:border-pink-active transition-colors"
                      />
                    </motion.div>
                  )}
                  <button
                    onClick={startMatch}
                    disabled={!jdInput.trim() || (!isOtherSelected && !selectedPosition) || (isOtherSelected && !customPosition.trim())}
                    className="w-full mt-6 py-3 rounded-xl-2xl bg-gradient-pink text-white font-semibold text-base-md hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-40 disabled:cursor-not-allowed shadow-card flex items-center justify-center gap-2"
                  >
                    开始分析 <Send className="w-4 h-4" />
                  </button>
                </div>
              )}

              {matchStep === 'loading' && (
                <div className="p-12 flex flex-col items-center">
                  <Loader2 className="w-16 h-16 text-pink-primary animate-spin" />
                  <p className="text-md-lg font-semibold text-text-primary mt-6">AI 分析中...</p>
                  <div className="mt-6 space-y-2">
                    {[
                      { text: '解析岗位JD', done: true },
                      { text: '匹配个人经历', done: true },
                      { text: '生成能力模型', done: false },
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {step.done ? <CheckCircle className="w-4 h-4 text-pink-primary" /> : <Loader2 className="w-3.5 h-3.5 text-pink-primary/40 animate-spin" />}
                        <span className={`text-sm-md ${step.done ? 'text-text-primary' : 'text-text-faint'}`}>{step.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchStep === 'result' && matchResult && (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-md-lg font-bold text-text-primary">{matchResult.position}</h3>
                      <p className={`text-xs-sm mt-0.5 font-semibold ${getLevelColor(matchResult.level)}`}>
                        {matchResult.level}
                      </p>
                    </div>
                    <button onClick={() => setMatchStep('idle')} className="text-text-tertiary hover:text-pink-primary transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* 分数卡片 */}
                  <div className={`rounded-xl-lg bg-gradient-to-br ${getScoreColor(matchResult.score)} p-5 mb-6 text-white`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-bold">{matchResult.score}%</span>
                        <p className="text-xs-sm opacity-80 mt-1">Match Score</p>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.round(matchResult.score / 20) ? 'fill-white text-white' : 'text-white/40'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm-md mt-3 opacity-90">{matchResult.summary}</p>
                  </div>

                  {/* 匹配点 */}
                  <p className="text-sm-md font-semibold text-text-secondary mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-pink-primary" /> 能力匹配
                  </p>
                  <div className="space-y-2 mb-6 max-h-56 overflow-y-auto">
                    {matchResult.matches?.map((m, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl-md bg-card-bg border border-border-pink-light">
                        <span className="text-base-md text-text-primary flex-1">{m.requirement}</span>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star key={j} className={`w-3 h-3 ${j < m.stars ? 'text-pink-primary fill-pink-light' : 'text-text-faint/30'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 匹配证据 */}
                  {matchResult.matches?.map((m, i) => (
                    <p key={i} className="text-xs-sm text-text-tertiary mb-1">
                      · <span className="text-text-secondary">{m.requirement}：</span>{m.evidence}
                    </p>
                  ))}

                  {/* 核心亮点 */}
                  {matchResult.highlights && matchResult.highlights.length > 0 && (
                    <>
                      <p className="text-sm-md font-semibold text-text-secondary mb-2 mt-5 flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-pink-primary" /> 核心亮点
                      </p>
                      <div className="p-4 rounded-xl-lg bg-pink-primary/5 border border-pink-primary/20 mb-6 space-y-1.5">
                        {matchResult.highlights.map((h, i) => (
                          <p key={i} className="text-xs-sm text-text-secondary">✨ {h}</p>
                        ))}
                      </div>
                    </>
                  )}

                  {/* 待提升 */}
                  {matchResult.gaps && matchResult.gaps.length > 0 && (
                    <>
                      <p className="text-sm-md font-semibold text-text-secondary mb-2 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-500" /> 待提升方向
                      </p>
                      <div className="p-4 rounded-xl-lg bg-amber-50 border border-amber-200 mb-6 space-y-1.5">
                        {matchResult.gaps.map((g, i) => (
                          <p key={i} className="text-xs-sm text-amber-800">· {g}</p>
                        ))}
                      </div>
                    </>
                  )}

                  {/* 成长建议 */}
                  {matchResult.recommendations && matchResult.recommendations.length > 0 && (
                    <>
                      <p className="text-sm-md font-semibold text-text-secondary mb-2 flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-pink-purple" /> 成长建议
                      </p>
                      <div className="p-4 rounded-xl-lg bg-purple-50 border border-purple-200 mb-6 space-y-1.5">
                        {matchResult.recommendations.map((r, i) => (
                          <p key={i} className="text-xs-sm text-purple-800">💡 {r}</p>
                        ))}
                      </div>
                    </>
                  )}

                  {/* 30秒自我介绍 */}
                  {matchResult.elevatorPitch && (
                    <>
                      <p className="text-sm-md font-semibold text-text-secondary mb-2 flex items-center gap-1.5">
                        <Brain className="w-4 h-4 text-pink-primary" /> 30秒自我介绍
                      </p>
                      <div className="p-4 rounded-xl-lg bg-card-bg-pink border border-border-pink-light mb-6">
                        <p className="text-sm-md text-text-primary leading-relaxed italic">
                          "{matchResult.elevatorPitch}"
                        </p>
                      </div>
                    </>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setMatchStep('input')} className="flex-1 py-2.5 rounded-xl-2xl border border-border-pink text-sm-md text-text-secondary font-medium hover:bg-pink-light/10 transition-colors flex items-center justify-center gap-1.5">
                      <RotateCcw className="w-4 h-4" /> 重新测试
                    </button>
                    <button className="flex-1 py-2.5 rounded-xl-2xl bg-gradient-pink text-white text-sm-md font-medium hover:scale-[1.02] transition-transform flex items-center justify-center gap-1.5">
                      <FileText className="w-4 h-4" /> 查看完整简历
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <ProductDetail caseData={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  )
}
