import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center"
          style={{ background: 'linear-gradient(180deg, #FFF5F7 0%, #FDE8F0 50%, #F5E6F5 100%)' }}
        >
          <div className="flex flex-col items-center gap-4">
            {/* Spinning star */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="text-4xl"
            >
              ✨
            </motion.div>

            {/* Loading dots */}
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full bg-pink-primary"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>

            <p className="text-sm-md text-text-tertiary font-medium">Jiajia's AI Lab</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
