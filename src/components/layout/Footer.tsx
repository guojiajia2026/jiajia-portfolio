import { Sparkles, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full px-4 mobile:px-6 py-3 flex items-center justify-between mobile:pb-4 pb-24">
      <div className="flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-pink-light" />
        <span className="text-xs-sm text-text-tertiary">
          © 2026 Jiajia's AI Lab · Personal AI Digital Card
        </span>
      </div>
      <div className="hidden mobile:flex items-center gap-3">
        <span className="text-xs-sm text-text-faint">
          Built with React + AI
        </span>
        <Heart className="w-3.5 h-3.5 text-pink-primary fill-pink-light" />
      </div>
    </footer>
  )
}
