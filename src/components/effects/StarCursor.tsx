import { useEffect, useRef } from 'react'

interface StarParticle {
  x: number
  y: number
  size: number
  life: number
  maxLife: number
  color: string
  vx: number
  vy: number
}

const colors = ['#FF8E9E', '#FFB6C1', '#DDA0DD', '#FFC0CB']

export function StarCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: StarParticle[] = []
    let mouseX = -100
    let mouseY = -100
    let lastX = -100
    let lastY = -100
    let frameCount = 0

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener('mousemove', handleMove)

    const drawStar = (x: number, y: number, size: number, alpha: number, color: string) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.globalAlpha = alpha
      ctx.fillStyle = color
      ctx.beginPath()
      const spikes = 5
      const outerRadius = size
      const innerRadius = size * 0.4
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius
        const angle = (Math.PI / spikes) * i - Math.PI / 2
        const px = Math.cos(angle) * radius
        const py = Math.sin(angle) * radius
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      frameCount++

      if (frameCount % 2 === 0) {
        const dx = mouseX - lastX
        const dy = mouseY - lastY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 2) {
          for (let i = 0; i < 2; i++) {
            particles.push({
              x: mouseX + (Math.random() - 0.5) * 8,
              y: mouseY + (Math.random() - 0.5) * 8,
              size: 3 + Math.random() * 4,
              life: 0,
              maxLife: 30 + Math.random() * 20,
              color: colors[Math.floor(Math.random() * colors.length)],
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5 - 0.3,
            })
          }
        }
      }

      lastX = mouseX
      lastY = mouseY

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.02
        p.size *= 0.98

        if (p.life >= p.maxLife || p.size < 0.5) {
          particles.splice(i, 1)
          continue
        }

        const alpha = 1 - p.life / p.maxLife
        drawStar(p.x, p.y, p.size, alpha * 0.8, p.color)
      }

      if (particles.length > 80) {
        particles.splice(0, particles.length - 80)
      }

      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
