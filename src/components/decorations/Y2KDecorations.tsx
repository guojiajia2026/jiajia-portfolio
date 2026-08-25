import { motion } from 'framer-motion'

export function SparkleStar({ size = 16, color = '#FFB6C1', className = '', delay = 0 }: {
  size?: number; color?: string; className?: string; delay?: number
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      animate={{ rotate: [0, 360], scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 4, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <path
        d="M12 0 L13.5 9 L24 12 L13.5 15 L12 24 L10.5 15 L0 12 L10.5 9 Z"
        fill={color}
        opacity={0.8}
      />
    </motion.svg>
  )
}

export function Butterfly({ size = 24, className = '', delay = 0 }: {
  size?: number; className?: string; delay?: number
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 5, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <path d="M24 24 C20 14, 10 8, 6 14 C3 19, 6 26, 14 26 C18 26, 22 25, 24 24 Z" fill="#FFB6C1" opacity="0.6" />
      <path d="M24 24 C28 14, 38 8, 42 14 C45 19, 42 26, 34 26 C30 26, 26 25, 24 24 Z" fill="#FF8E9E" opacity="0.5" />
      <path d="M24 24 C22 30, 20 36, 22 40 C23 42, 25 42, 26 40 C28 36, 26 30, 24 24 Z" fill="#DDA0DD" opacity="0.4" />
      <ellipse cx="24" cy="24" rx="1.5" ry="10" fill="#3D2C3A" opacity="0.3" />
    </motion.svg>
  )
}

export function HeartIcon({ size = 16, color = '#FF8E9E', className = '', delay = 0 }: {
  size?: number; color?: string; className?: string; delay?: number
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 3, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <path
        d="M12 21 C12 21, 4 14, 4 8.5 C4 5.5, 6 3, 9 3 C10.5 3, 12 4, 12 5.5 C12 4, 13.5 3, 15 3 C18 3, 20 5.5, 20 8.5 C20 14, 12 21, 12 21 Z"
        fill={color}
      />
    </motion.svg>
  )
}

export function PixelStar({ size = 20, className = '', delay = 0 }: {
  size?: number; className?: string; delay?: number
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.1, 0.9] }}
      transition={{ duration: 2.5, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <rect x="7" y="0" width="2" height="2" fill="#FF8E9E" />
      <rect x="7" y="2" width="2" height="2" fill="#FFB6C1" />
      <rect x="5" y="4" width="2" height="2" fill="#FFB6C1" />
      <rect x="9" y="4" width="2" height="2" fill="#FFB6C1" />
      <rect x="3" y="6" width="2" height="2" fill="#FF8E9E" />
      <rect x="7" y="6" width="2" height="2" fill="#FF8E9E" />
      <rect x="11" y="6" width="2" height="2" fill="#FF8E9E" />
      <rect x="0" y="7" width="2" height="2" fill="#FFB6C1" />
      <rect x="5" y="7" width="2" height="2" fill="#FFB6C1" />
      <rect x="9" y="7" width="2" height="2" fill="#FFB6C1" />
      <rect x="14" y="7" width="2" height="2" fill="#FFB6C1" />
      <rect x="3" y="8" width="2" height="2" fill="#FF8E9E" />
      <rect x="7" y="8" width="2" height="2" fill="#FF8E9E" />
      <rect x="11" y="8" width="2" height="2" fill="#FF8E9E" />
      <rect x="5" y="9" width="2" height="2" fill="#FFB6C1" />
      <rect x="9" y="9" width="2" height="2" fill="#FFB6C1" />
      <rect x="7" y="10" width="2" height="2" fill="#FFB6C1" />
      <rect x="7" y="12" width="2" height="2" fill="#FF8E9E" />
    </motion.svg>
  )
}

export function SparkleBurst({ size = 24, className = '', delay = 0 }: {
  size?: number; className?: string; delay?: number
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      animate={{ rotate: [0, 90, 0], scale: [0.8, 1, 0.8] }}
      transition={{ duration: 6, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <path d="M16 4 L17 14 L27 16 L17 18 L16 28 L15 18 L5 16 L15 14 Z" fill="#FFB6C1" opacity="0.5" />
      <circle cx="16" cy="16" r="2" fill="#FF8E9E" opacity="0.6" />
      <path d="M16 0 L16 3 M16 29 L16 32 M0 16 L3 16 M29 16 L32 16" stroke="#FFB6C1" strokeWidth="1" opacity="0.3" />
    </motion.svg>
  )
}

export function Y2KBackgroundDecorations() {
  const decorations = [
    { type: 'star', top: '5%', left: '8%', size: 20, delay: 0 },
    { type: 'butterfly', top: '12%', right: '6%', size: 28, delay: 1 },
    { type: 'heart', top: '25%', left: '4%', size: 14, delay: 0.5 },
    { type: 'pixel', top: '40%', right: '10%', size: 18, delay: 1.5 },
    { type: 'sparkle', top: '55%', left: '6%', size: 22, delay: 2 },
    { type: 'star', top: '70%', right: '5%', size: 16, delay: 0.8 },
    { type: 'butterfly', top: '85%', left: '12%', size: 24, delay: 2.5 },
    { type: 'heart', top: '90%', right: '15%', size: 12, delay: 1.2 },
    { type: 'pixel', top: '15%', left: '45%', size: 16, delay: 3 },
    { type: 'sparkle', top: '60%', right: '30%', size: 18, delay: 0.3 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
      {decorations.map((d, i) => (
        <div
          key={i}
          className="absolute"
          style={{ top: d.top, left: d.left, right: d.right }}
        >
          {d.type === 'star' && <SparkleStar size={d.size} delay={d.delay} />}
          {d.type === 'butterfly' && <Butterfly size={d.size} delay={d.delay} />}
          {d.type === 'heart' && <HeartIcon size={d.size} delay={d.delay} />}
          {d.type === 'pixel' && <PixelStar size={d.size} delay={d.delay} />}
          {d.type === 'sparkle' && <SparkleBurst size={d.size} delay={d.delay} />}
        </div>
      ))}
    </div>
  )
}
