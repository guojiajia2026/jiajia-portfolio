import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'

interface LightboxProps {
  images: string[]
  index: number
  isOpen: boolean
  onClose: () => void
}

export function Lightbox({ images, index, isOpen, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(index)

  useEffect(() => {
    setCurrent(index)
  }, [index])

  if (!isOpen) return null

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[200] flex items-center justify-center"
        style={{ background: 'rgba(60,40,50,0.8)', backdropFilter: 'blur(8px)' }}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10">
          <X className="w-8 h-8" />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-6 text-white/70 hover:text-white transition-colors p-2"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-6 text-white/70 hover:text-white transition-colors p-2"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        <motion.img
          key={current}
          src={images[current]}
          alt="Preview"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="max-w-[80vw] max-h-[80vh] object-contain rounded-xl-lg shadow-2xl"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />

        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? 'bg-white w-6' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
