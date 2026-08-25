import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, Briefcase, Award, Heart, Star,
  MapPin, Sparkles, Trophy, BookOpen, Users, Music, ChevronRight,
  ArrowRight, BookMarked,
} from 'lucide-react'
import {
  mockProfile, mockSkills, mockEducation, mockInternships,
  mockAwards, mockHobbies, mockCertificates, mockCampus, mockExp,
  mockProductCases, mockExperienceLibrary,
} from '@/data/mockData'
import type { ProductCase } from '@/types'
import { Lightbox } from '@/components/common/Lightbox'
import { InternshipDetail } from '@/components/profile/InternshipDetail'
import { ProductDetail } from '@/components/explore/ProductDetail'
import { SparkleStar, HeartIcon } from '@/components/decorations/Y2KDecorations'
import { ScrollReveal } from '@/components/effects/ScrollReveal'

const internPhotos: Record<string, string> = {
  '字节跳动': '/assets/photo-intern-bytedance.jpg',
  '小米': '/assets/photo-intern-xiaomi.jpg',
  '快手': '/assets/photo-intern-kuaishou.jpg',
  '美团': '/assets/photo-intern-meituan.jpg',
}

const companyBadges: Record<string, string> = {
  '字节跳动': '/assets/badge-bytedance.jpg',
  '小米': '/assets/badge-xiaomi.jpg',
  '美团': '/assets/badge-meituan.jpg',
  '快手': '/assets/badge-kuaishou.jpg',
}

const personalPhotos = [
  '/assets/photo-personal-1.jpg',
  '/assets/photo-personal-2.jpg',
  '/assets/photo-personal-3.jpg',
]

export function ProfilePage() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [selectedIntern, setSelectedIntern] = useState<typeof mockInternships[0] | null>(null)
  const [internModalOpen, setInternModalOpen] = useState(false)
  const [selectedCase, setSelectedCase] = useState<ProductCase | null>(null)
  const [expandedTags, setExpandedTags] = useState<Record<string, boolean>>({})

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images)
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const openInternDetail = (intern: typeof mockInternships[0]) => {
    setSelectedIntern(intern)
    setInternModalOpen(true)
  }

  const openProductCase = (caseId: string) => {
    const caseData = mockProductCases.find(c => c.id === caseId)
    if (caseData) {
      setSelectedCase(caseData)
      setInternModalOpen(false)
    }
  }

  const toggleTag = (tag: string) => {
    setExpandedTags(prev => ({ ...prev, [tag]: !prev[tag] }))
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
      {/* ===== Section 1: 基本信息 ===== */}
      <ScrollReveal>
      <section className="glass rounded-xl-3xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-5 h-5 text-pink-primary" />
          <div>
            <h2 className="text-xl-2xl font-bold text-text-primary">基本信息</h2>
            <p className="text-xs-sm text-text-faint">Basic Information</p>
          </div>
          <SparkleStar size={14} className="ml-auto" delay={0.5} />
        </div>

        <div className="grid grid-cols-1 desktop:grid-cols-3 gap-5">
          {/* Left: Avatar + Info */}
          <div className="desktop:col-span-1">
            <div className="flex flex-col items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-36 h-36 rounded-full p-[3px] cursor-pointer hover:shadow-avatar-glow transition-all relative"
                style={{ background: 'linear-gradient(135deg, #FFB6C1, #DDA0DD)', borderRadius: '50%' }}
                onClick={() => openLightbox(personalPhotos, 0)}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-pink-light/20 relative">
                  <img
                    src="/assets/ip-character-transparent.png"
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => { e.currentTarget.src = '/assets/ip-character.png' }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-pink flex items-center justify-center shadow-card border-2 border-white">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              </motion.div>
              <div className="text-center">
                <h3 className="text-xl-2xl font-bold text-text-primary">{mockProfile.name}</h3>
                <p className="text-sm-md text-text-secondary mt-0.5">{mockProfile.title}</p>
                <div className="flex items-center justify-center gap-2 mt-1.5">
                  <div className="status-dot" />
                  <span className="text-xs-sm text-text-tertiary">求职中 · AI产品方向</span>
                </div>
              </div>

              {/* Personal Photos - 3 stacked polaroid style */}
              <div className="flex gap-2 mt-1">
                {personalPhotos.map((photo, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, rotate: i === 0 ? -8 : i === 1 ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0, rotate: i === 0 ? -6 : i === 1 ? 0 : 6 }}
                    whileHover={{ scale: 1.15, rotate: 0, zIndex: 10 }}
                    onClick={() => openLightbox(personalPhotos, i)}
                    className="w-16 h-20 rounded-xl-md overflow-hidden border-2 border-white shadow-card cursor-pointer"
                    onError={(e: any) => { e.currentTarget.style.display = 'none' }}
                  >
                    <img
                      src={photo}
                      alt={`Personal ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
              <p className="text-xs-sm text-text-faint">📸 点击照片查看大图</p>
            </div>
          </div>

          {/* Right: Info Grid */}
          <div className="desktop:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: GraduationCap, label: '学历', value: '保险硕士', sub: '中央财经大学' },
                { icon: Trophy, label: '专业排名', value: '4/51', sub: '硕士阶段' },
                { icon: MapPin, label: '所在地', value: '北京', sub: '籍贯山东' },
                { icon: BookOpen, label: '政治面貌', value: '中共党员', sub: '党龄3年' },
              ].map((tag, i) => (
                <div key={i} className="rounded-xl-md p-3 bg-card-bg border border-border-pink-light hover:border-pink-active transition-colors">
                  <div className="flex items-center gap-1.5 mb-1">
                    <tag.icon className="w-3.5 h-3.5 text-text-tertiary" />
                    <span className="text-xs-sm text-text-tertiary">{tag.label}</span>
                  </div>
                  <p className="text-base-md font-semibold text-text-primary">{tag.value}</p>
                  <p className="text-xs-sm text-text-faint mt-0.5">{tag.sub}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl-lg p-4 bg-card-bg-pink border border-border-pink-light">
              <div className="flex items-center gap-2 mb-3">
                <img
                  src="/assets/badge-university.jpg"
                  alt="校徽"
                  className="w-6 h-6 rounded-full object-cover border border-border-pink-light"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                <p className="text-xs-sm text-text-tertiary font-medium">教育经历</p>
              </div>
              <div className="space-y-3">
                {mockEducation.map((edu, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${edu.highlight ? 'bg-pink-primary' : 'bg-pink-light'}`} />
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <span className="text-base-md font-medium text-text-primary">{edu.school}</span>
                        <span className="text-xs-sm text-text-tertiary ml-2">{edu.degree}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs-sm text-text-faint">{edu.period}</span>
                        {edu.highlight && <span className="text-xs-sm text-pink-primary px-1.5 py-0.5 rounded bg-pink-primary/10 font-medium">在读</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {mockCertificates.map((cert, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl-sm bg-pink-light/12 border border-border-pink-light">
                  <span className="text-xs-sm text-text-secondary font-medium">{cert.name}</span>
                  <span className="text-xs-sm text-pink-primary font-bold">{cert.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ===== Section 2: 技能树 ===== */}
      <ScrollReveal delay={0.1}>
      <section className="glass rounded-xl-3xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-5">
          <Star className="w-5 h-5 text-pink-primary fill-pink-light" />
          <div>
            <h2 className="text-xl-2xl font-bold text-text-primary">技能树</h2>
            <p className="text-xs-sm text-text-faint">Skill Tree</p>
          </div>
          <HeartIcon size={14} className="ml-auto" delay={0.3} />
        </div>

        <div className="grid grid-cols-1 desktop:grid-cols-2 gap-4">
          {mockSkills.map((skill) => (
            <div key={skill.id} className="rounded-xl-lg p-4 bg-card-bg border border-border-pink-light hover:border-pink-active hover:shadow-card transition-all group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base-md font-semibold text-text-primary">{skill.icon} {skill.name}</span>
                <span className="text-xs-sm text-pink-primary font-bold">Lv.{skill.level}</span>
              </div>
              <div className="progress-bar mb-3">
                <div className="progress-bar-fill" style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }} />
              </div>
              {skill.details && (
                <div className="space-y-1.5">
                  <div className="flex flex-wrap gap-1.5">
                    {skill.details.knowledge.map((k, i) => {
                      const tagExperiences = mockExperienceLibrary.filter(exp => exp.tag === k || exp.brief.includes(k))
                      const hasExperiences = tagExperiences.length > 0
                      const tagKey = `${skill.id}-${k}`
                      const isExpanded = expandedTags[tagKey]
                      return (
                        <button
                          key={i}
                          onClick={() => hasExperiences && toggleTag(tagKey)}
                          className={`text-xs-sm px-2 py-0.5 rounded-lg transition-all ${
                            hasExperiences
                              ? 'bg-pink-light/15 text-pink-primary font-medium hover:bg-pink-light/25 cursor-pointer'
                              : 'bg-pink-light/10 text-text-secondary'
                          }`}
                        >
                          {k}
                          {hasExperiences && (
                            <span className="ml-1 text-text-faint">{isExpanded ? '▾' : '▸'}</span>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Experience Library - expands when tag is clicked */}
                  <AnimatePresence>
                    {skill.details.knowledge.map((k) => {
                      const tagKey = `${skill.id}-${k}`
                      const tagExperiences = mockExperienceLibrary.filter(exp => exp.tag === k || exp.brief.includes(k))
                      if (expandedTags[tagKey] && tagExperiences.length > 0) {
                        return (
                          <motion.div
                            key={tagKey}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 p-3 rounded-xl-md bg-pink-light/8 border border-pink-light/20 space-y-2"
                          >
                            <div className="flex items-center gap-1.5 text-xs-sm text-text-faint">
                              <BookMarked className="w-3 h-3" />
                              <span>经历库 · {k}</span>
                            </div>
                            {tagExperiences.map((exp) => (
                              <button
                                key={exp.id}
                                onClick={() => exp.caseId && openProductCase(exp.caseId)}
                                className={`w-full flex items-start gap-2 p-2 rounded-lg bg-white/40 hover:bg-pink-light/15 transition-colors text-left ${
                                  exp.caseId ? 'cursor-pointer' : 'cursor-default'
                                }`}
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs-sm font-semibold text-text-primary truncate">{exp.project}</span>
                                    <span className="text-xs-sm text-text-faint shrink-0">{exp.company}</span>
                                  </div>
                                  <p className="text-xs-sm text-text-tertiary mt-0.5">{exp.brief}</p>
                                </div>
                                {exp.caseId && (
                                  <ArrowRight className="w-3 h-3 text-pink-primary shrink-0 mt-1" />
                                )}
                              </button>
                            ))}
                          </motion.div>
                        )
                      }
                      return null
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl-lg p-4 bg-gradient-to-r from-pink-light/15 to-pink-purple/10 border border-border-pink-light">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm-md text-text-secondary font-medium">AI PM 成长值</span>
            <span className="text-md-lg font-bold text-pink-primary">{mockExp.value}%</span>
          </div>
          <div className="progress-bar h-2">
            <div className="progress-bar-fill h-2" style={{ width: `${mockExp.value}%` }} />
          </div>
          <div className="flex items-center gap-4 mt-2">
            {mockExp.records.map((r, i) => (
              <span key={i} className="text-xs-sm text-text-tertiary">{r.label} <span className="text-pink-primary font-semibold">{r.value}</span></span>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ===== Section 3: 实习经历 ===== */}
      <ScrollReveal delay={0.2}>
      <section className="glass rounded-xl-3xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-5">
          <Briefcase className="w-5 h-5 text-pink-primary" />
          <div>
            <h2 className="text-xl-2xl font-bold text-text-primary">实习经历</h2>
            <p className="text-xs-sm text-text-faint">Internship Experience</p>
          </div>
          <span className="text-xs-sm text-text-faint ml-auto">4段大厂 · 点击查看详情</span>
        </div>

        <div className="grid grid-cols-1 desktop:grid-cols-2 gap-4">
          {mockInternships.map((intern, idx) => {
            const photo = internPhotos[intern.company]
            const isHighlighted = intern.highlight
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                onClick={() => openInternDetail(intern)}
                className={`rounded-xl-lg p-4 border transition-all cursor-pointer group ${
                  isHighlighted
                    ? 'bg-gradient-to-br from-pink-light/15 to-white/40 border-pink-active shadow-card hover:shadow-card-hover'
                    : 'bg-card-bg border-border-pink-light hover:border-pink-active'
                }`}
              >
                <div className="flex items-start gap-3">
                  {photo ? (
                    <div className="relative shrink-0">
                      <img
                        src={photo}
                        alt={intern.company}
                        className="w-14 h-14 rounded-xl-md object-cover border-2 border-white shadow-card group-hover:scale-105 transition-transform"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                      {companyBadges[intern.company] && (
                        <img
                          src={companyBadges[intern.company]}
                          alt=""
                          className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full object-cover border-2 border-white shadow-card"
                          onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="relative shrink-0">
                      <div className={`w-14 h-14 rounded-xl-md flex items-center justify-center ${isHighlighted ? 'bg-gradient-pink' : 'bg-pink-light/30'}`}>
                        <span className={`text-md-lg font-bold ${isHighlighted ? 'text-white' : 'text-text-tertiary'}`}>{intern.company[0]}</span>
                      </div>
                      {companyBadges[intern.company] && (
                        <img
                          src={companyBadges[intern.company]}
                          alt=""
                          className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full object-cover border-2 border-white shadow-card"
                          onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-base-md font-bold ${isHighlighted ? 'text-text-primary' : 'text-text-secondary'}`}>{intern.company}</span>
                      {isHighlighted && (
                        <span className="text-xs-sm text-white px-2 py-0.5 rounded-full bg-gradient-pink font-bold">大厂</span>
                      )}
                    </div>
                    <span className="text-xs-sm text-text-faint">{intern.period}</span>
                    <p className="text-xs-sm text-text-secondary mt-0.5">{intern.role} · {intern.department}</p>
                    <p className="text-xs-sm text-text-tertiary mt-1 line-clamp-2">{intern.description}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs-sm text-pink-primary">
                      <span>查看详情</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>
      </ScrollReveal>

      {/* ===== Section 4: 获奖经历 ===== */}
      <ScrollReveal delay={0.3}>
      <section className="glass rounded-xl-3xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-5">
          <Award className="w-5 h-5 text-pink-primary" />
          <div>
            <h2 className="text-xl-2xl font-bold text-text-primary">获奖经历</h2>
            <p className="text-xs-sm text-text-faint">Awards & Honors</p>
          </div>
          <span className="text-xs-sm text-text-faint ml-auto">12项 · 含国家级/省级奖项</span>
        </div>

        <div className="grid grid-cols-1 desktop:grid-cols-2 gap-3">
          {mockAwards.map((award, i) => {
            const isTop = award.level.includes('一等奖') || award.level.includes('金奖') || award.level.includes('全国')
            return (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl-md border hover:scale-[1.02] transition-all ${
                  isTop ? 'bg-gradient-to-r from-pink-light/15 to-transparent border-pink-active' : 'bg-card-bg border-border-pink-light'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isTop ? 'bg-gradient-pink' : 'bg-pink-light/20'}`}>
                  <Trophy className={`w-4 h-4 ${isTop ? 'text-white' : 'text-pink-primary'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm-md text-text-primary font-medium truncate">{award.name}</p>
                  <p className="text-xs-sm text-text-tertiary">{award.category} · {award.year}</p>
                </div>
                <span className={`text-xs-sm font-bold px-2 py-1 rounded shrink-0 ${isTop ? 'text-white bg-gradient-pink' : 'text-pink-primary bg-pink-primary/10'}`}>
                  {award.level}
                </span>
              </div>
            )
          })}
        </div>

        <div className="mt-5 pt-5 border-t border-border-pink-light">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-pink-primary" />
            <h3 className="text-sm-md font-semibold text-text-secondary">校园经历 · Campus Life</h3>
          </div>
          <div className="grid grid-cols-1 desktop:grid-cols-3 gap-3">
            {mockCampus.map((c, i) => (
              <div key={i} className="p-3 rounded-xl-md bg-card-bg border border-border-pink-light hover:border-pink-active transition-colors">
                <p className="text-sm-md text-text-primary font-medium">{c.role}</p>
                <p className="text-xs-sm text-text-faint mt-0.5">{c.period}</p>
                <p className="text-xs-sm text-text-tertiary mt-1">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ===== Section 5: 爱好特长 ===== */}
      <ScrollReveal delay={0.4}>
      <section className="glass rounded-xl-3xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-5">
          <Heart className="w-5 h-5 text-pink-primary fill-pink-light" />
          <div>
            <h2 className="text-xl-2xl font-bold text-text-primary">爱好特长</h2>
            <p className="text-xs-sm text-text-faint">Hobbies & Talents</p>
          </div>
          <span className="text-xs-sm text-text-faint ml-auto">户外探索 · 演讲主持</span>
        </div>

        <div className="grid grid-cols-2 desktop:grid-cols-4 gap-4">
          {mockHobbies.map((hobby, i) => (
            <div
              key={i}
              onClick={() => openLightbox([hobby.photo], 0)}
              className="rounded-xl-lg overflow-hidden bg-card-bg border border-border-pink-light hover:border-pink-active transition-all hover:shadow-card group cursor-pointer"
            >
              <div className="relative h-32 overflow-hidden">
                <img
                  src={hobby.photo}
                  alt={hobby.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute top-2 left-2 text-xl-lg">{hobby.icon}</span>
              </div>
              <div className="p-3">
                <p className="text-sm-md font-semibold text-text-primary">{hobby.name}</p>
                <p className="text-xs-sm text-text-tertiary mt-0.5">{hobby.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border-pink-light">
          <div className="flex items-center gap-2 mb-3">
            <Music className="w-4 h-4 text-pink-primary" />
            <h3 className="text-sm-md font-semibold text-text-secondary">舞台经验 · Stage Experience</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['健美操比赛', '迎新晚会主持', '演讲比赛×3'].map((s, i) => (
              <span key={i} className="flex items-center gap-1 px-3 py-1.5 rounded-xl-sm bg-pink-light/15 text-xs-sm text-text-secondary hover:bg-pink-light/25 transition-colors">
                <Sparkles className="w-3 h-3 text-pink-primary" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        index={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      {/* Internship Detail Modal */}
      <InternshipDetail
        data={selectedIntern}
        isOpen={internModalOpen}
        onClose={() => setInternModalOpen(false)}
        onProjectClick={openProductCase}
      />

      {/* Product Detail Modal */}
      <ProductDetail
        caseData={selectedCase}
        onClose={() => setSelectedCase(null)}
      />
    </div>
  )
}
