import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Sparkles, RotateCcw, X, Heart } from 'lucide-react'

interface TreasureHuntProps {
  photos: { src: string; label: string }[]
  onPhotoClick: (index: number) => void
}

interface Cell {
  isTreasure: boolean
  photoIndex: number
  revealed: boolean
}

const GRID_COLS = 5
const GRID_ROWS = 3
const TOTAL_CELLS = GRID_COLS * GRID_ROWS

export function TreasureHunt({ photos, onPhotoClick }: TreasureHuntProps) {
  const [grid, setGrid] = useState<Cell[]>(() => {
    const cells: Cell[] = Array.from({ length: TOTAL_CELLS }, () => ({
      isTreasure: false,
      photoIndex: -1,
      revealed: false,
    }))
    const indices = Array.from({ length: TOTAL_CELLS }, (_, i) => i)
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }
    photos.forEach((_, idx) => {
      cells[indices[idx]].isTreasure = true
      cells[indices[idx]].photoIndex = idx
    })
    return cells
  })
  const [foundCount, setFoundCount] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)

  const handleCellClick = useCallback(
    (index: number) => {
      setGrid((prev) => {
        if (prev[index].revealed) return prev
        const newGrid = [...prev]
        newGrid[index] = { ...newGrid[index], revealed: true }
        if (newGrid[index].isTreasure) {
          setFoundCount((c) => {
            const next = c + 1
            if (next === photos.length) {
              setTimeout(() => setShowCelebration(true), 300)
            }
            return next
          })
        }
        return newGrid
      })
    },
    [photos.length]
  )

  const handleReset = () => {
    setGrid(() => {
      const cells: Cell[] = Array.from({ length: TOTAL_CELLS }, () => ({
        isTreasure: false,
        photoIndex: -1,
        revealed: false,
      }))
      const indices = Array.from({ length: TOTAL_CELLS }, (_, i) => i)
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[indices[i], indices[j]] = [indices[j], indices[i]]
      }
      photos.forEach((_, idx) => {
        cells[indices[idx]].isTreasure = true
        cells[indices[idx]].photoIndex = idx
      })
      return cells
    })
    setFoundCount(0)
    setShowCelebration(false)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-pink-primary" />
          <span className="text-xs-sm font-semibold text-text-primary">寻宝游戏</span>
          <span className="text-xs-sm text-text-faint">找到 {foundCount}/{photos.length} 张照片</span>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-pink-light/15 text-xs-sm text-pink-primary hover:bg-pink-light/25 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          重置
        </button>
      </div>

      {/* Progress bar */}
      <div className="progress-bar mb-3">
        <div
          className="progress-bar-fill"
          style={{ width: `${(foundCount / photos.length) * 100}%` }}
        />
      </div>

      {/* Grid */}
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}
      >
        {grid.map((cell, idx) => (
          <motion.button
            key={idx}
            onClick={() => handleCellClick(idx)}
            whileHover={!cell.revealed ? { scale: 1.05 } : {}}
            whileTap={!cell.revealed ? { scale: 0.95 } : {}}
            className={`aspect-square rounded-xl-md flex items-center justify-center text-lg transition-all ${
              cell.revealed
                ? cell.isTreasure
                  ? 'bg-gradient-pink shadow-card'
                  : 'bg-pink-light/8'
                : 'glass-white hover:shadow-card cursor-pointer'
            }`}
          >
            {cell.revealed ? (
              cell.isTreasure ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onPhotoClick(cell.photoIndex)
                  }}
                  className="w-full h-full rounded-xl-md overflow-hidden cursor-pointer"
                >
                  <img
                    src={photos[cell.photoIndex].src}
                    alt={photos[cell.photoIndex].label}
                    className="w-full h-full object-cover rounded-xl-md"
                  />
                </motion.div>
              ) : (
                <span className="text-text-faint/30 text-xs">·</span>
              )
            ) : (
              <Sparkles className="w-4 h-4 text-pink-light/40" />
            )}
          </motion.button>
        ))}
      </div>

      <p className="text-xs-sm text-text-faint mt-2 text-center">
        {foundCount === 0
          ? '🌸 点击格子寻找佳佳的照片宝藏~'
          : foundCount < photos.length
          ? `已找到 ${foundCount} 张，继续探索~`
          : '🎉 全部找到啦！点击照片查看大图~'}
      </p>

      {/* Celebration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mt-2 glass rounded-xl-md p-3 flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-pink-primary fill-pink-light" />
            <span className="text-xs-sm text-text-primary">
              恭喜你找到了所有照片！点击照片可以查看大图哦~
            </span>
            <button
              onClick={() => setShowCelebration(false)}
              className="ml-auto"
            >
              <X className="w-3.5 h-3.5 text-text-faint" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
