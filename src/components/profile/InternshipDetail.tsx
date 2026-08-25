import { motion, AnimatePresence } from 'framer-motion'
import { X, Briefcase, Calendar, Building2, Star, ArrowRight } from 'lucide-react'

interface InternshipData {
  company: string
  period: string
  role: string
  department: string
  tags: string[]
  description: string
  photo?: string
  highlight: boolean
  projects?: { name: string; detail: string; tags: string[]; caseId?: string }[]
}

interface InternshipDetailProps {
  data: InternshipData | null
  isOpen: boolean
  onClose: () => void
  onProjectClick?: (caseId: string) => void
}

const companyBadges: Record<string, string> = {
  '字节跳动': '/assets/badge-bytedance.jpg',
  '小米': '/assets/badge-xiaomi.jpg',
  '美团': '/assets/badge-meituan.jpg',
  '快手': '/assets/badge-kuaishou.jpg',
}

export function InternshipDetail({ data, isOpen, onClose, onProjectClick }: InternshipDetailProps) {
  if (!data) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          style={{ background: 'rgba(60,40,50,0.6)', backdropFilter: 'blur(6px)' }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-modal rounded-xl-4xl shadow-card-hover w-[900px] max-w-full max-h-[85vh] overflow-y-auto no-scrollbar relative"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-text-tertiary hover:text-pink-primary transition-colors z-10 w-8 h-8 rounded-full hover:bg-pink-light/15 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 desktop:grid-cols-2 gap-0">
              {/* Left: Large Photo */}
              <div className="relative h-[300px] desktop:h-full desktop:min-h-[400px] overflow-hidden rounded-t-xl-4xl desktop:rounded-l-xl-4xl desktop:rounded-tr-none">
                {data.photo ? (
                  <img
                    src={data.photo}
                    alt={data.company}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-pink flex items-center justify-center">
                    <Building2 className="w-20 h-20 text-white/60" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent desktop:bg-gradient-to-r" />
                <div className="absolute bottom-0 left-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {data.highlight && (
                      <span className="px-2 py-0.5 rounded-full bg-pink-primary text-white text-xs-sm font-bold">
                        大厂经历
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {companyBadges[data.company] && (
                      <img
                        src={companyBadges[data.company]}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/50 shadow-card shrink-0"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                    )}
                    <div>
                      <h2 className="text-xl-2xl font-bold text-white">{data.company}</h2>
                      <p className="text-sm-md text-white/80 mt-1">{data.role}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Details */}
              <div className="p-6 space-y-5">
                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm-md text-text-secondary">
                    <Briefcase className="w-4 h-4 text-pink-primary" />
                    <span>{data.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm-md text-text-secondary">
                    <Calendar className="w-4 h-4 text-pink-primary" />
                    <span>{data.period}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4 rounded-xl-lg bg-card-bg-pink border border-border-pink-light">
                  <p className="text-base-md text-text-primary leading-relaxed">{data.description}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {data.tags.map((tag, i) => (
                    <span key={i} className="text-xs-sm text-pink-primary px-2.5 py-1 rounded-lg bg-pink-primary/10 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Projects */}
                {data.projects && data.projects.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 text-pink-primary fill-pink-light" />
                      <h3 className="text-sm-md font-bold text-text-primary">参与项目</h3>
                      <span className="text-xs-sm text-text-faint ml-1">点击查看详情 →</span>
                    </div>
                    <div className="space-y-2.5">
                      {data.projects.map((project, i) => {
                        const hasCase = project.caseId && onProjectClick
                        return (
                          <motion.button
                            key={i}
                            onClick={() => hasCase && onProjectClick(project.caseId!)}
                            whileHover={hasCase ? { x: 4, scale: 1.02 } : {}}
                            className={`w-full text-left p-4 rounded-xl-lg border transition-all ${
                              hasCase
                                ? 'bg-card-bg border-border-pink-light hover:border-pink-active hover:shadow-card cursor-pointer'
                                : 'bg-card-bg border-border-pink-light'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-base-md font-semibold text-text-primary mb-1">{project.name}</p>
                                <p className="text-xs-sm text-text-tertiary leading-relaxed mb-2">{project.detail}</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {project.tags.map((t, j) => (
                                    <span key={j} className="text-xs-sm text-text-secondary px-2 py-0.5 rounded bg-pink-light/10">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              {hasCase && (
                                <div className="flex items-center gap-1 shrink-0 mt-1">
                                  <span className="text-xs-sm text-pink-primary font-medium">详情</span>
                                  <ArrowRight className="w-3.5 h-3.5 text-pink-primary" />
                                </div>
                              )}
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
