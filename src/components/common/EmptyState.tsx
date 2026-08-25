import { motion } from 'framer-motion'
import { SearchX, RotateCcw } from 'lucide-react'

interface EmptyStateProps {
  icon?: 'search' | 'chat' | 'result'
  title: string
  description?: string
  onRetry?: () => void
}

const iconMap = {
  search: SearchX,
  chat: SearchX,
  result: SearchX,
}

export function EmptyState({ icon = 'search', title, description, onRetry }: EmptyStateProps) {
  const Icon = iconMap[icon]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-12 px-6"
    >
      <div className="w-16 h-16 rounded-full bg-pink-light/15 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-pink-primary" />
      </div>
      <p className="text-md-lg font-semibold text-text-primary mb-1">{title}</p>
      {description && (
        <p className="text-xs-sm text-text-tertiary text-center max-w-xs">{description}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl-md bg-gradient-pink text-white text-xs-sm font-medium shadow-card hover:shadow-card-hover transition-all hover:scale-105"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          重试
        </button>
      )}
    </motion.div>
  )
}
