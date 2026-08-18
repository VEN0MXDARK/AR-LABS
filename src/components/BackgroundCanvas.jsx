import { useRef, useEffect } from 'react'
import { usePerfTier } from '../hooks/usePerfTier'

export default function BackgroundCanvas() {
  const ref = useRef()
  const { reducedMotion } = usePerfTier()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const draw = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const pts = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      }))
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const d = Math.sqrt(dx*dx + dy*dy)
          if (d < 180) {
            ctx.globalAlpha = (1 - d/180) * 0.10
            ctx.strokeStyle = '#00c8e0'; ctx.lineWidth = 0.5
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke()
          }
        }
      ctx.globalAlpha = 1
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.2, 0, Math.PI*2)
        ctx.fillStyle = 'rgba(0,200,240,0.38)'; ctx.fill()
      })
    }
    draw()
    window.addEventListener('resize', draw)
    return () => window.removeEventListener('resize', draw)
  }, [])

  /* Subtle parallax drift opposite the cursor, for depth vs. foreground content. */
  useEffect(() => {
    if (reducedMotion) return
    const canvas = ref.current
    const onMove = (e) => {
      const dx = (e.clientX / window.innerWidth  - 0.5) * -14
      const dy = (e.clientY / window.innerHeight - 0.5) * -14
      canvas.style.transform = `translate(${dx}px, ${dy}px) scale(1.02)`
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [reducedMotion])

  return <canvas ref={ref} className="bg-canvas" />
}
