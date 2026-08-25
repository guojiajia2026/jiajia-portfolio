import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { TabBar, type TabId } from '@/components/layout/TabBar'
import { Footer } from '@/components/layout/Footer'
import { HomePage } from '@/pages/HomePage'
import { ProfilePage } from '@/pages/ProfilePage'
import { ExplorePage } from '@/pages/ExplorePage'
import { FloatingChat } from '@/components/chat/FloatingChat'
import { StarCursor } from '@/components/effects/StarCursor'
import { Y2KBackgroundDecorations } from '@/components/decorations/Y2KDecorations'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { PageLoader } from '@/components/effects/PageLoader'

function GradientOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div className="absolute top-[5%] right-[5%] w-72 h-72 rounded-full bg-pink-light/15 blur-3xl" />
      <div className="absolute top-[40%] left-[3%] w-64 h-64 rounded-full bg-pink-purple/10 blur-3xl" />
      <div className="absolute bottom-[10%] right-[10%] w-80 h-80 rounded-full bg-pink-primary/8 blur-3xl" />
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home')

  return (
    <ErrorBoundary>
      <PageLoader />
      <div className="min-h-screen w-full flex flex-col relative">
        <StarCursor />
        <GradientOrbs />
        <Y2KBackgroundDecorations />
        <Navbar />
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 pb-20 mobile:pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {activeTab === 'home' && <HomePage onTabChange={setActiveTab} />}
              {activeTab === 'profile' && <ProfilePage />}
              {activeTab === 'explore' && <ExplorePage />}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
        <FloatingChat />
      </div>
    </ErrorBoundary>
  )
}

export default App
