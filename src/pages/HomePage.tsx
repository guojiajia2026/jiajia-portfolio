import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Rocket, Briefcase, Award, FolderKanban, GraduationCap, Sparkles, Heart, MapPin } from 'lucide-react'
import type { TabId } from '@/components/layout/TabBar'
import { Lightbox } from '@/components/common/Lightbox'
import { TreasureHunt } from '@/components/common/TreasureHunt'
import { SparkleStar, HeartIcon, PixelStar } from '@/components/decorations/Y2KDecorations'

interface HomePageProps {
  onTabChange: (tab: TabId) => void
}

const personalPhotos = [
  { src: '/assets/photo-personal-1.jpg', label: '咖啡店日常' },
  { src: '/assets/photo-personal-2.jpg', label: '个人照' },
  { src: '/assets/photo-personal-3.jpg', label: '生活照' },
]

const quickEntries = [
  { tab: 'profile' as TabId, icon: User, label: '个人档案', desc: '技能 · 经历 · 获奖', color: 'from-pink-light to-pink-primary' },
  { tab: 'explore' as TabId, icon: Rocket, label: '探索中心', desc: '岗位匹配 · 产品馆', color: 'from-pink-purple to-pink-light' },
]

const stats = [
  { icon: Briefcase, label: '大厂实习', value: '4段' },
  { icon: Award, label: '竞赛获奖', value: '12项' },
  { icon: FolderKanban, label: '产品案例', value: '13个' },
  { icon: GraduationCap, label: '教育经历', value: '3校' },
]

const tags = ['AI产品', '商业化', '数据分析', '用户增长', 'RAG架构', 'AIGC']

export function HomePage({ onTabChange }: HomePageProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState(0)

  const handlePhotoClick = (index: number) => {
    setCurrentPhoto(index)
    setLightboxOpen(true)
  }

  return (
    <div className="relative min-h-[calc(100vh-200px)] px-4 mobile:px-6 py-6 overflow-hidden">
      {/* Y2K decorative */}
      <SparkleStar size={20} className="absolute top-4 left-[6%]" delay={0} />
      <HeartIcon size={14} className="absolute top-32 left-[4%]" delay={0.5} />
      <PixelStar size={18} className="absolute top-1/2 right-[5%]" delay={1.5} />
      <SparkleStar size={16} className="absolute bottom-32 right-[15%]" delay={0.8} />
      <HeartIcon size={12} className="absolute top-1/3 right-[20%]" delay={1.2} />

      <div className="max-w-5xl mx-auto">
        {/* Hero: IP + Name + Treasure Hunt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative flex flex-col items-center mb-8"
        >
          {/* IP Character - enlarged with blurred background */}
          <div className="relative w-full flex items-center justify-center mb-4">
            {/* Blurred IP at bottom */}
            <img
              src="/assets/ip-character-transparent.png"
              alt=""
              className="absolute bottom-0 w-96 h-96 object-contain opacity-20 blur-2xl scale-125"
              aria-hidden
            />
            {/* Glow background */}
            <div className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-pink-light/25 via-pink-primary/10 to-pink-purple/15 blur-3xl" />

            {/* Floating sparkles */}
            <SparkleStar size={14} className="absolute top-8 left-12 z-20" delay={0.3} />
            <SparkleStar size={10} className="absolute top-16 right-16 z-20" delay={1.2} />
            <HeartIcon size={12} className="absolute bottom-20 left-8 z-20" delay={0.8} />

            {/* Main IP - enlarged */}
            <motion.img
              src="/assets/ip-character-transparent.png"
              alt="Jiajia IP"
              className="relative w-72 h-72 mobile:w-80 mobile:h-80 object-contain drop-shadow-2xl z-10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
          </div>

          {/* Name + Title */}
          <div className="text-center relative z-10 -mt-4">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-xl-2xl mobile:text-2xl-2xl font-bold text-text-primary">郭佳佳</h1>
              <SparkleStar size={18} delay={0.5} />
            </div>
            <p className="text-sm-md text-text-secondary mt-1">AI Product Explorer</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="status-dot" />
              <span className="text-xs-sm text-text-tertiary">正在探索AI × 商业增长</span>
            </div>
          </div>
        </motion.div>

        {/* Two-column: Left = About + Stats + Entries | Right = Treasure Hunt */}
        <div className="grid grid-cols-1 desktop:grid-cols-2 gap-4">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            {/* About Me */}
            <div className="glass-white rounded-xl-2xl p-5 shadow-card relative overflow-hidden">
              <HeartIcon size={16} className="absolute top-3 right-3" delay={0.5} />
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-pink-primary fill-pink-light" />
                <div>
                  <span className="text-base-md font-bold text-text-primary">关于我</span>
                  <span className="text-xs-sm text-text-faint ml-2">About Me</span>
                </div>
              </div>
              <p className="text-md-lg font-semibold text-text-primary leading-relaxed">
                从金融研究出发，探索AI如何重构商业增长的产品经理
              </p>
              <p className="text-sm-md text-text-secondary mt-2 leading-relaxed">
                中央财经大学保险硕士，4段大厂实习（字节/小米/美团/快手），聚焦AI商业化方向。
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-xl-sm bg-pink-light/15 text-xs-sm text-pink-primary font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2">
              {stats.map(({ icon: Icon, label, value }, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="glass-white rounded-xl-md p-2.5 text-center shadow-card"
                >
                  <Icon className="w-4 h-4 text-pink-primary mx-auto mb-1" />
                  <p className="text-md-lg font-bold text-text-primary">{value}</p>
                  <p className="text-xs-sm text-text-faint">{label}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick Entries */}
            <div className="grid grid-cols-2 gap-2">
              {quickEntries.map(({ tab, icon: Icon, label, desc, color }, idx) => (
                <motion.button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-white rounded-xl-xl p-3 shadow-card text-left group relative overflow-hidden"
                >
                  <PixelStar size={14} className="absolute top-2 right-2 opacity-50" delay={idx * 0.5} />
                  <div className={`w-9 h-9 rounded-xl-md bg-gradient-to-br ${color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm-md font-semibold text-text-primary">{label}</p>
                  <p className="text-xs-sm text-text-tertiary">{desc}</p>
                </motion.button>
              ))}
            </div>

            {/* Education + Big tech */}
            <div className="glass rounded-xl-lg p-3 shadow-card flex items-center gap-3">
              <img
                src="/assets/badge-university.jpg"
                alt="校徽"
                className="w-10 h-10 rounded-xl-md object-cover border-2 border-white shadow-card shrink-0"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm-md font-semibold text-text-primary truncate">中央财经大学 · 保险硕士</p>
                <p className="text-xs-sm text-text-tertiary truncate">山东财经大学（专业第1）| 西南财经大学（交流）</p>
              </div>
              <MapPin className="w-3.5 h-3.5 text-text-faint shrink-0" />
              <span className="text-xs-sm text-text-faint">北京</span>
            </div>

            <div className="glass rounded-xl-lg p-3 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-pink-primary" />
                <span className="text-sm-md font-semibold text-text-primary">大厂经历</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { name: '字节跳动', badge: '/assets/badge-bytedance.jpg' },
                  { name: '小米', badge: '/assets/badge-xiaomi.jpg' },
                  { name: '美团', badge: '/assets/badge-meituan.jpg' },
                  { name: '快手', badge: '/assets/badge-kuaishou.jpg' },
                ].map((company, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-xl-md bg-gradient-pink text-white text-xs-sm font-bold shadow-card">
                    <img
                      src={company.badge}
                      alt=""
                      className="w-5 h-5 rounded-full object-cover border border-white/50 shrink-0"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                    <span className="truncate">{company.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right column: Treasure Hunt Game */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="glass-white rounded-xl-2xl p-5 shadow-card h-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🎁</span>
                <div>
                  <h3 className="text-base-md font-bold text-text-primary">寻宝游戏</h3>
                  <p className="text-xs-sm text-text-faint">Treasure Hunt - 找到佳佳的隐藏照片</p>
                </div>
              </div>
              <TreasureHunt
                photos={personalPhotos}
                onPhotoClick={handlePhotoClick}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <Lightbox
        images={personalPhotos.map(p => p.src)}
        index={currentPhoto}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  )
}
