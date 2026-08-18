import { useRef, useEffect } from 'react'

/* ═══════════════════════════════════════════════
   GLOBE — pure 2D canvas with perspective projection
   - Icosahedron wireframe (42 nodes, 120 edges)
   - Depth-modulated brightness
   - Purple radial inner glow
   - Equatorial cyan ring + tilted purple ring
   - Glow via shadowBlur
═══════════════════════════════════════════════ */
export default function GlobeCanvas() {
  const ref = useRef()
  const animRef = useRef()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')

    /* ── Build icosahedron geometry ── */
    const PHI = (1 + Math.sqrt(5)) / 2
    let verts = [
      [-1, PHI, 0],[1, PHI, 0],[-1,-PHI, 0],[1,-PHI, 0],
      [ 0,-1, PHI],[0,  1, PHI],[ 0,-1,-PHI],[0,  1,-PHI],
      [ PHI, 0,-1],[PHI, 0, 1],[-PHI, 0,-1],[-PHI, 0, 1],
    ].map(([x,y,z]) => { const l=Math.sqrt(x*x+y*y+z*z); return [x/l,y/l,z/l] })

    let faces = [
      [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
      [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
      [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
      [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
    ]

    // One subdivision → 42 vertices, 80 faces, 120 edges
    const midCache = {}
    const getMid = (a, b) => {
      const key = a < b ? `${a}_${b}` : `${b}_${a}`
      if (midCache[key] != null) return midCache[key]
      const [x1,y1,z1] = verts[a], [x2,y2,z2] = verts[b]
      const mx=(x1+x2)/2, my=(y1+y2)/2, mz=(z1+z2)/2
      const l = Math.sqrt(mx*mx+my*my+mz*mz)
      verts.push([mx/l, my/l, mz/l])
      return (midCache[key] = verts.length - 1)
    }
    const subFaces = []
    faces.forEach(([a,b,c]) => {
      const ab=getMid(a,b), bc=getMid(b,c), ca=getMid(c,a)
      subFaces.push([a,ab,ca],[b,bc,ab],[c,ca,bc],[ab,bc,ca])
    })
    faces = subFaces

    const edgeSet = new Set(); const edges = []
    faces.forEach(([a,b,c]) => {
      [[a,b],[b,c],[c,a]].forEach(([u,v]) => {
        const k = u<v?`${u}_${v}`:`${v}_${u}`
        if (!edgeSet.has(k)) { edgeSet.add(k); edges.push([u,v]) }
      })
    })

    /* ── Canvas sizing ── */
    let W, H, CX, CY, R
    const resize = () => {
      if (!canvas.parentElement) return
      W = canvas.width  = canvas.parentElement.clientWidth
      H = canvas.height = canvas.parentElement.clientHeight
      CX = W * 0.5; CY = H * 0.5
      R  = Math.min(W, H) * 0.30
    }
    resize()
    window.addEventListener('resize', resize)

    /* ── Draw loop ── */
    const draw = (ts) => {
      if (!W) { animRef.current = requestAnimationFrame(draw); return }
      ctx.clearRect(0, 0, W, H)

      const t   = ts * 0.001
      const rotY  = t * 0.20
      const tiltX = 0.18 + Math.sin(t * 0.07) * 0.04

      const cosY=Math.cos(rotY), sinY=Math.sin(rotY)
      const cosTX=Math.cos(tiltX), sinTX=Math.sin(tiltX)

      const project = ([nx,ny,nz]) => {
        // Rotate around Y
        const px  =  nx*cosY + nz*sinY
        const pz  = -nx*sinY + nz*cosY
        // Tilt around X
        const fpy = ny*cosTX - pz*sinTX
        const fpz = ny*sinTX + pz*cosTX
        return {
          sx: CX + px*R,
          sy: CY + fpy*R,
          depth: (fpz + 1) / 2,   // 0=back 1=front
          z: fpz,
        }
      }

      const proj = verts.map(project)

      /* ── 1. Inner glow sphere ── */
      const grd = ctx.createRadialGradient(CX, CY, 0, CX, CY, R*0.95)
      grd.addColorStop(0,    'rgba(170, 40, 255, 0.96)')
      grd.addColorStop(0.30, 'rgba(120, 10, 230, 0.78)')
      grd.addColorStop(0.58, 'rgba(75,   0, 170, 0.48)')
      grd.addColorStop(0.80, 'rgba(35,   0, 100, 0.18)')
      grd.addColorStop(1,    'rgba(8,    0,  30, 0.00)')
      ctx.fillStyle = grd
      ctx.beginPath(); ctx.arc(CX, CY, R*0.95, 0, Math.PI*2); ctx.fill()

      /* ── 2. Ring 1 BACK (equatorial cyan) ── */
      ctx.save()
      ctx.globalAlpha = 0.50
      ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 1.8
      ctx.shadowColor  = '#00d4ff'; ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.ellipse(CX, CY, R*1.30, R*0.20, 0, Math.PI, Math.PI*2)
      ctx.stroke()
      ctx.restore()

      /* ── 3. Ring 2 BACK (tilted purple) ── */
      ctx.save()
      ctx.translate(CX, CY); ctx.rotate(-0.32)
      ctx.globalAlpha = 0.50
      ctx.strokeStyle = '#aa44ff'; ctx.lineWidth = 1.4
      ctx.shadowColor  = '#aa44ff'; ctx.shadowBlur = 8
      ctx.beginPath()
      ctx.ellipse(0, 0, R*1.44, R*0.52, 0, Math.PI, Math.PI*2)
      ctx.stroke()
      ctx.restore()

      /* ── 4. Network EDGES (depth-modulated) ── */
      ctx.lineCap = 'round'
      edges.forEach(([i,j]) => {
        const a = proj[i], b = proj[j]
        const d = (a.depth + b.depth) * 0.5
        ctx.shadowColor = '#00c8e0'
        ctx.shadowBlur  = 2 + d*5
        ctx.strokeStyle = `rgba(0,210,238,${(d*0.62+0.10).toFixed(2)})`
        ctx.lineWidth   = 0.85 + d*0.65
        ctx.beginPath(); ctx.moveTo(a.sx,a.sy); ctx.lineTo(b.sx,b.sy); ctx.stroke()
      })

      /* ── 5. Network NODES (back→front) ── */
      const sorted = [...proj].sort((a,b) => a.z - b.z)
      sorted.forEach(p => {
        const r     = 2.8 + p.depth * 5.5
        const alpha = p.depth * 0.75 + 0.25

        // Outer glow
        ctx.shadowColor = '#00e5ff'
        ctx.shadowBlur  = 8 + p.depth * 16
        ctx.fillStyle   = `rgba(0,210,255,${(alpha*0.60).toFixed(2)})`
        ctx.beginPath(); ctx.arc(p.sx, p.sy, r*1.7, 0, Math.PI*2); ctx.fill()

        // Bright core
        ctx.shadowBlur  = 0
        ctx.fillStyle   = `rgba(210,248,255,${alpha.toFixed(2)})`
        ctx.beginPath(); ctx.arc(p.sx, p.sy, r*0.55, 0, Math.PI*2); ctx.fill()
      })

      /* ── 6. Ring 1 FRONT (equatorial cyan) ── */
      ctx.save()
      ctx.globalAlpha = 0.92
      ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 2.2
      ctx.shadowColor  = '#00d4ff'; ctx.shadowBlur = 15
      ctx.beginPath()
      ctx.ellipse(CX, CY, R*1.30, R*0.20, 0, 0, Math.PI)
      ctx.stroke()
      ctx.restore()

      /* ── 7. Ring 2 FRONT (tilted purple) ── */
      ctx.save()
      ctx.translate(CX, CY); ctx.rotate(-0.32)
      ctx.globalAlpha = 0.82
      ctx.strokeStyle = '#bb55ff'; ctx.lineWidth = 1.7
      ctx.shadowColor  = '#bb55ff'; ctx.shadowBlur = 13
      ctx.beginPath()
      ctx.ellipse(0, 0, R*1.44, R*0.52, 0, 0, Math.PI)
      ctx.stroke()
      ctx.restore()

      /* ── 8. Outer ambient halo ── */
      const halo = ctx.createRadialGradient(CX, CY, R*0.85, CX, CY, R*1.65)
      halo.addColorStop(0,   'rgba(0,100,200,0.00)')
      halo.addColorStop(0.5, 'rgba(0, 90,200,0.06)')
      halo.addColorStop(1,   'rgba(0, 40,140,0.00)')
      ctx.fillStyle = halo
      ctx.globalAlpha = 1
      ctx.beginPath(); ctx.arc(CX, CY, R*1.65, 0, Math.PI*2); ctx.fill()

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return <canvas ref={ref} style={{ width:'100%', height:'100%', display:'block' }} />
}
