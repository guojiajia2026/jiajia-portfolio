import { Home, User, Rocket } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

export type TabId = 'home' | 'profile' | 'explore'

interface TabConfig {
  id: TabId
  label: string
  icon: LucideIcon
}

const tabs: TabConfig[] = [
  { id: 'home', label: '首页', icon: Home },
  { id: 'profile', label: '档案', icon: User },
  { id: 'explore', label: '探索', icon: Rocket },
]

interface TabBarProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <>
      {/* Desktop / Tablet: top capsule */}
      <nav className="hidden mobile:flex items-center justify-center gap-1 px-4 py-2 sticky top-14 z-30">
        <div className="glass rounded-full px-2 py-1.5 flex items-center gap-1 shadow-card">
          {tabs.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`relative flex items-center gap-1.5 px-6 py-2 rounded-full text-sm-md font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-white'
                    : 'text-text-secondary hover:bg-pink-light/20 hover:text-pink-primary'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-highlight"
                    className="absolute inset-0 rounded-full bg-gradient-pink shadow-card"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Mobile: bottom fixed tab bar */}
      <nav className="mobile:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="glass-modal border-t border-pink-light/30 px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-around">
            {tabs.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id
              return (
                <button
                  key={id}
                  onClick={() => onTabChange(id)}
                  className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl-md transition-all duration-200 ${
                    isActive ? 'text-pink-primary' : 'text-text-faint'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  <span className="text-xs-sm font-medium">{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="mobile-tab-dot"
                      className="w-1 h-1 rounded-full bg-pink-primary"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
