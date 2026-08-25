import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Building2, Lightbulb, Target, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react'
import type { ProductCase } from '@/types'

interface ProductDetailProps {
  caseData: ProductCase | null
  onClose: () => void
}

export function ProductDetail({ caseData, onClose }: ProductDetailProps) {
  return (
    <AnimatePresence>
      {caseData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-modal rounded-xl-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto no-scrollbar relative"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 glass-modal rounded-t-xl-3xl border-b border-pink-light/20 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{caseData.icon}</span>
                <div>
                  <h2 className="text-xl-2xl font-bold text-text-primary">{caseData.name}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-text-faint" />
                    <span className="text-xs-sm text-text-secondary">{caseData.company}</span>
                    <span className="text-xs-sm text-text-faint">·</span>
                    <span className="text-xs-sm text-pink-primary font-medium">{caseData.tag}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < caseData.stars
                          ? 'text-pink-primary fill-pink-light'
                          : 'text-text-faint/30'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-pink-light/15 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-text-secondary" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-5">
              {/* Desc */}
              <div className="glass-white rounded-xl-lg p-4">
                <p className="text-sm-md text-text-primary font-medium leading-relaxed">
                  {caseData.desc}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {caseData.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded bg-pink-light/12 text-xs-sm text-pink-primary font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Background */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-pink-light/15 flex items-center justify-center">
                    <Lightbulb className="w-3.5 h-3.5 text-pink-primary" />
                  </div>
                  <h3 className="text-sm-md font-bold text-text-primary">
                    业务背景
                    <span className="text-xs-sm text-text-faint font-normal ml-2">Background</span>
                  </h3>
                </div>
                <p className="text-xs-sm text-text-secondary leading-relaxed pl-9">
                  {caseData.background}
                </p>
              </div>

              {/* Solution */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-pink-light/15 flex items-center justify-center">
                    <Target className="w-3.5 h-3.5 text-pink-primary" />
                  </div>
                  <h3 className="text-sm-md font-bold text-text-primary">
                    解决方案
                    <span className="text-xs-sm text-text-faint font-normal ml-2">Solution</span>
                  </h3>
                </div>
                <div className="pl-9 space-y-2">
                  {caseData.solution.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-pink-primary mt-0.5 shrink-0" />
                      <span className="text-xs-sm text-text-secondary leading-relaxed">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-pink-light/15 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-pink-primary" />
                  </div>
                  <h3 className="text-sm-md font-bold text-text-primary">
                    项目成果
                    <span className="text-xs-sm text-text-faint font-normal ml-2">Results</span>
                  </h3>
                </div>
                <div className="pl-9 grid grid-cols-2 gap-2">
                  {caseData.results.map((result, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-white rounded-xl-md p-3 text-center"
                    >
                      <p className="text-lg-xl font-bold text-gradient-pink">{result.value}</p>
                      <p className="text-xs-sm text-text-faint mt-0.5">{result.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div className="glass rounded-xl-lg p-4 border-l-3 border-pink-primary">
                <div className="flex items-center gap-2 mb-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-pink-primary" />
                  <span className="text-xs-sm font-bold text-pink-primary">个人收获与反思</span>
                </div>
                <p className="text-xs-sm text-text-secondary leading-relaxed">
                  {caseData.insights}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
