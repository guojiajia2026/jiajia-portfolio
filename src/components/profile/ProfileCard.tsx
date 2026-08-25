import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, MapPin, Sparkles, Award, X, Briefcase, Heart } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { mockProfile, mockSkills, mockExp, mockInternships } from '@/data/mockData'

const iconMap: Record<string, LucideIcon> = {
  education: GraduationCap,
  location: MapPin,
  award: Award,
  sparkles: Sparkles,
}

export function ProfileCard() {
  const [showModal, setShowModal] = useState(false)
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null)
  const [showExpTooltip, setShowExpTooltip] = useState(false)

  return (
    <div className="glass rounded-xl-3xl p-6 shadow-card">
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => setShowModal(true)}
          className="relative w-20 h-20 rounded-full p-[2px] transition-all duration-300 hover:shadow-avatar-glow"
          style={{
            background: 'linear-gradient(135deg, #FFB6C1, #DDA0DD)',
            borderRadius: '50%',
          }}
        >
          <div className="w-full h-full rounded-full bg-pink-light/30 flex items-center justify-center overflow-hidden">
            <img
              src="/assets/ip-character.png"
              alt="Avatar"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        </button>

        <h2 className="text-xl-2xl font-bold text-text-primary mt-3">
          {mockProfile.name}
        </h2>
        <p className="text-sm-md text-text-secondary mt-0.5">
          {mockProfile.title}
        </p>
        <p className="text-xs-sm text-text-tertiary mt-0.5">
          {mockProfile.school}
        </p>

        <div className="mt-3 px-4 py-1.5 rounded-xl-sm bg-pink-light/25 text-xs-sm text-pink-primary font-medium flex items-center gap-1">
          <Heart className="w-3 h-3 fill-pink-primary" />
          Online AI Profile
        </div>
      </div>

      {/* Info Tags */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {mockProfile.tags.map((tag, idx) => {
          const Icon = iconMap[tag.icon] || Sparkles
          return (
            <div
              key={idx}
              className="rounded-xl-md p-3 bg-card-bg border border-border-pink-light"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="w-3.5 h-3.5 text-text-tertiary" />
                <span className="text-xs-sm text-text-tertiary">{tag.label}</span>
              </div>
              <p className="text-base-md font-semibold text-text-primary">
                {tag.value}
              </p>
              {tag.subValue && (
                <p className="text-xs-sm text-text-faint mt-0.5">
                  {tag.subValue}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Skill Tree */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm-md font-semibold text-text-secondary">
            Skill Tree
          </span>
          <span className="text-xs-sm text-pink-primary cursor-pointer hover:text-pink-primary/80 transition-colors">
            View All →
          </span>
        </div>
        <div className="space-y-2">
          {mockSkills.map((skill) => (
            <div key={skill.id}>
              <button
                onClick={() => setExpandedSkill(expandedSkill === skill.id ? null : skill.id)}
                className="w-full flex items-center gap-3 py-1"
              >
                <span className="text-base-md min-w-[100px] text-left">
                  {skill.icon} {skill.name}
                </span>
                <div className="flex-1 progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                  />
                </div>
                <span className="text-xs-sm text-text-tertiary min-w-[30px] text-right">
                  {skill.level}/{skill.maxLevel}
                </span>
              </button>
              <AnimatePresence>
                {expandedSkill === skill.id && skill.details && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 p-4 rounded-xl-md bg-card-bg-pink border border-border-pink-light">
                      <p className="text-xs-sm text-text-tertiary mb-2">
                        ✨ {skill.details.title}
                      </p>
                      <p className="text-xs-sm text-text-secondary mb-1">Knowledge:</p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {skill.details.knowledge.map((k, i) => (
                          <span key={i} className="text-xs-sm text-text-secondary px-2 py-0.5 rounded-lg bg-pink-light/10">
                            {k}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs-sm text-text-secondary mb-1">Projects:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {skill.details.projects.map((p, i) => (
                          <span key={i} className="text-xs-sm text-pink-primary px-2 py-0.5 rounded-lg bg-pink-primary/10">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* EXP Bar */}
      <div
        className="mt-6 relative"
        onMouseEnter={() => setShowExpTooltip(true)}
        onMouseLeave={() => setShowExpTooltip(false)}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs-sm text-text-tertiary">
            AI PM EXP
          </span>
          <span className="text-xs-sm text-pink-primary font-semibold">
            {mockExp.value}%
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${mockExp.value}%` }}
          />
        </div>
        <p className="text-xs-sm text-text-faint mt-1">
          Next Level: {mockExp.nextLevel}
        </p>
        <AnimatePresence>
          {showExpTooltip && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute bottom-full left-0 mb-2 glass-modal rounded-xl-md p-4 shadow-tooltip z-10 w-full"
            >
              <p className="text-xs-sm text-text-secondary mb-2 font-semibold">
                📈 成长记录
              </p>
              {mockExp.records.map((r, i) => (
                <div key={i} className="flex items-center justify-between py-0.5">
                  <span className="text-xs-sm text-text-tertiary">{r.label}</span>
                  <span className="text-xs-sm text-pink-primary font-semibold">{r.value}</span>
                </div>
              ))}
              <p className="text-xs-sm text-text-faint mt-2 pt-2 border-t border-border-pink-light">
                距下一级还需 35 EXP
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Internship Timeline */}
      <div className="mt-6">
        <div className="flex items-center gap-1.5 mb-3">
          <Briefcase className="w-4 h-4 text-pink-primary" />
          <span className="text-sm-md font-semibold text-text-secondary">
            实习经历
          </span>
        </div>
        <div className="space-y-3">
          {mockInternships.slice(0, 4).map((intern, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-pink-primary shrink-0 mt-1.5" />
                {idx < 3 && <div className="w-px flex-1 bg-border-pink-light mt-1" />}
              </div>
              <div className="pb-1 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-base-md font-medium text-text-primary">
                    {intern.company}
                  </p>
                  <span className="text-xs-sm text-text-faint">
                    {intern.period}
                  </span>
                </div>
                <p className="text-xs-sm text-text-tertiary mt-0.5">
                  {intern.role} · {intern.department}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Character Profile Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(60,40,50,0.5)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-modal rounded-xl-4xl p-8 shadow-card-hover w-[420px] max-w-[90vw]"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-text-tertiary hover:text-pink-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center mb-6">
                <img
                  src="/assets/ip-character.png"
                  alt="Character"
                  className="w-24 h-24 object-contain rounded-full"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                <h3 className="text-md-lg font-bold text-text-primary mt-3">郭佳佳</h3>
                <p className="text-xs-sm text-text-tertiary">AI Product Explorer</p>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs-sm text-text-tertiary mb-1">角色信息</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-xl-sm bg-pink-light/20 text-xs-sm text-pink-primary">中央财经大学</span>
                    <span className="px-3 py-1 rounded-xl-sm bg-pink-light/20 text-xs-sm text-pink-primary">保险硕士</span>
                    <span className="px-3 py-1 rounded-xl-sm bg-pink-light/20 text-xs-sm text-pink-primary">中共党员</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs-sm text-text-tertiary mb-1">技能等级</p>
                  <div className="space-y-1.5">
                    {[
                      { name: '商业分析', level: 5 },
                      { name: '产品设计', level: 4 },
                      { name: 'AI探索', level: 3 },
                      { name: '数据分析', level: 4 },
                    ].map((s) => (
                      <div key={s.name} className="flex items-center gap-2">
                        <span className="text-xs-sm text-text-secondary min-w-[60px]">{s.name}</span>
                        <div className="flex-1 progress-bar">
                          <div className="progress-bar-fill" style={{ width: `${(s.level / 7) * 100}%` }} />
                        </div>
                        <span className="text-xs-sm text-text-faint">Lv.{s.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs-sm text-text-tertiary mb-1">经历时间线</p>
                  <div className="space-y-1">
                    <p className="text-xs-sm text-text-secondary">2023 · 金融研究（民生 · 华泰 · 国金）</p>
                    <p className="text-xs-sm text-text-secondary">2024 · 产品探索（快手 · 美团 · 小米 · 字节）</p>
                    <p className="text-xs-sm text-text-secondary">2025 · AI PM方向</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
