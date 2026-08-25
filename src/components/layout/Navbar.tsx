import { Heart, Sparkles } from 'lucide-react'

export function Navbar() {
  return (
    <header className="w-full px-4 mobile:px-6 py-3 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md bg-white/30">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl-md bg-gradient-pink flex items-center justify-center shadow-card">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-md-lg font-bold text-text-primary">
            Jiajia's AI Lab
          </span>
          <span className="text-xs-sm text-text-faint hidden mobile:inline">
            AI Digital Business Card
          </span>
        </div>
        <Heart className="w-4 h-4 text-pink-primary fill-pink-light" />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl-sm bg-pink-light/12">
          <div className="status-dot" />
          <span className="text-xs-sm text-text-secondary">AI Online</span>
        </div>
        <span className="text-xs-sm text-text-faint hidden mobile:inline">
          Powered by Knowledge Base
        </span>
      </div>
    </header>
  )
}
