import { useRef, useMemo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import './index.css'
import whatsappCrmImg from './assets/whatsapp-crm.jpg'

const WHATSAPP_LINK = 'https://wa.me/message/HYIOIGP6X36HJ1'

/* Base product price, stored in PKR. Rates are approximate, for display only. */
const PRODUCT_PRICE_PKR = 999
const CURRENCIES = {
  PKR: { symbol: '₨',   rate: 1,       decimals: false },
  INR: { symbol: '₹',   rate: 0.303,   decimals: false },
  USD: { symbol: '$',   rate: 0.00365, decimals: true  },
  EUR: { symbol: '€',   rate: 0.00333, decimals: true  },
  GBP: { symbol: '£',   rate: 0.00288, decimals: true  },
  AED: { symbol: 'د.إ', rate: 0.01335, decimals: true  },
}

function formatPrice(currency) {
  const { symbol, rate, decimals } = CURRENCIES[currency]
  const amount = PRODUCT_PRICE_PKR * rate
  return `${symbol}${decimals ? amount.toFixed(2) : Math.round(amount)}`
}

/* ═══════════════════════════════════════════════
   CONSTELLATION BACKGROUND
═══════════════════════════════════════════════ */
function BackgroundCanvas() {
  const ref = useRef()
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
  return <canvas ref={ref} className="bg-canvas" />
}

/* ═══════════════════════════════════════════════
   GLOBE — pure 2D canvas with perspective projection
   Matches the AETHER reference exactly:
   - Icosahedron wireframe (42 nodes, 120 edges)
   - Depth-modulated brightness
   - Purple radial inner glow
   - Equatorial cyan ring + tilted purple ring
   - Glow via shadowBlur
═══════════════════════════════════════════════ */
function GlobeCanvas() {
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

/* ═══════════════════════════════════════════════
   FEATURE CARD
═══════════════════════════════════════════════ */
const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07"/>
      </svg>
    ),
    color: '#a855f7',
    title: 'AUTOMATION HUB',
    desc: 'Streamline workflows with powerful automation tools.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6"  y1="20" x2="6"  y2="14"/>
        <line x1="2"  y1="20" x2="22" y2="20"/>
      </svg>
    ),
    color: '#00aaff',
    title: 'DATA ANALYTICS',
    desc: 'Real-time insights and customizable reporting.',
  },
]

function FeatureCard({ icon, color, title, desc, index }) {
  return (
    <motion.div
      className="feat-card"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.48, delay: index * 0.10 }}
    >
      <div className="feat-icon" style={{ color }}>{icon}</div>
      <h3 className="feat-title">{title}</h3>
      <p className="feat-desc">{desc}</p>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════
   FEATURED PRODUCT CARD (image + price, click → WhatsApp)
═══════════════════════════════════════════════ */
function ProductCard({ currency }) {
  return (
    <motion.a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="product-card"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.48 }}
    >
      <div className="product-media">
        <img src={whatsappCrmImg} alt="WhatsApp CRM" className="product-img" />
        <span className="product-price">{formatPrice(currency)}</span>
      </div>
      <div className="product-body">
        <h3 className="feat-title">WHATSAPP CRM</h3>
        <p className="feat-desc">Turn WhatsApp conversations into structured leads, straight into your pipeline.</p>
        <span className="product-cta">
          Chat on WhatsApp
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>
          </svg>
        </span>
      </div>
    </motion.a>
  )
}

/* ═══════════════════════════════════════════════
   ICON PRODUCT CARD (icon + price, click → WhatsApp)
═══════════════════════════════════════════════ */
const ICON_PRODUCTS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="2"/>
        <path d="M12 2v6M12 16v6M2 12h6M16 12h6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M19.07 4.93l-4.24 4.24M9.17 14.83l-4.24 4.24"/>
      </svg>
    ),
    color: '#22cc88',
    title: 'WEB SCRAPER',
    desc: 'Automated data extraction from any website, delivered clean and structured.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="6" width="12" height="12" rx="2"/>
        <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>
      </svg>
    ),
    color: '#00d4aa',
    title: 'LOCAL LLM AI',
    desc: 'Your own private AI model, running locally — no cloud, no data leaves your device.',
  },
]

function IconProductCard({ icon, color, title, desc, currency, index }) {
  return (
    <motion.a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="feat-card linkable"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.48, delay: index * 0.10 }}
    >
      <div className="feat-icon" style={{ color }}>{icon}</div>
      <h3 className="feat-title">{title}</h3>
      <p className="feat-desc">{desc}</p>
      <div className="price-row">
        <span className="price-tag">{formatPrice(currency)}</span>
        <span className="product-cta">
          Chat on WhatsApp
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>
          </svg>
        </span>
      </div>
    </motion.a>
  )
}

/* ═══════════════════════════════════════════════
   BLOG POSTS
═══════════════════════════════════════════════ */
const BLOG_POSTS = [
  {
    date: 'AUG 12, 2026',
    title: 'Why Automation Is the Future of CRM',
    desc: 'How neural workflow automation is replacing manual pipeline work for growing sales teams.',
  },
  {
    date: 'JUL 28, 2026',
    title: '5 Ways WhatsApp Data Extraction Boosts Sales',
    desc: 'Turning raw conversation data into structured leads your CRM can actually use.',
  },
  {
    date: 'JUL 09, 2026',
    title: 'Inside AR Labs: Building Neural Tools',
    desc: 'A behind-the-scenes look at the analytics engine powering our automation hub.',
  },
]

function BlogCard({ date, title, desc, index }) {
  return (
    <motion.div
      className="feat-card"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.48, delay: index * 0.10 }}
    >
      <span className="blog-date">{date}</span>
      <h3 className="feat-title">{title}</h3>
      <p className="feat-desc">{desc}</p>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════
   CURRENCY SWITCHER
═══════════════════════════════════════════════ */
function CurrencySwitcher({ currency, setCurrency }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="currency-switcher" ref={ref}>
      <button
        className={`currency-btn${open ? ' open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {CURRENCIES[currency].symbol} {currency}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <ul className="currency-menu" role="listbox">
          {Object.keys(CURRENCIES).map(code => (
            <li key={code}>
              <button
                role="option"
                aria-selected={code === currency}
                className={`currency-option${code === currency ? ' active' : ''}`}
                onClick={() => { setCurrency(code); setOpen(false) }}
              >
                {CURRENCIES[code].symbol} {code}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   WHATSAPP FLOATING BUTTON
═══════════════════════════════════════════════ */
function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" fill="currentColor">
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.66 4.523 1.804 6.383L4 29l7.805-1.77A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.818a9.78 9.78 0 0 1-4.99-1.365l-.358-.213-4.632 1.05 1.04-4.512-.234-.37A9.77 9.77 0 0 1 6.182 15c0-5.415 4.407-9.818 9.822-9.818S25.818 9.585 25.818 15 21.42 24.818 16.004 24.818Zm5.4-7.34c-.296-.148-1.75-.864-2.02-.963-.272-.099-.47-.148-.667.148-.198.297-.766.963-.94 1.161-.173.198-.346.223-.642.075-.297-.148-1.253-.462-2.386-1.472-.882-.787-1.478-1.76-1.651-2.057-.173-.297-.018-.457.13-.605.134-.133.297-.347.445-.52.148-.174.198-.297.297-.495.099-.198.05-.372-.025-.52-.074-.148-.667-1.607-.914-2.202-.24-.579-.484-.5-.667-.51-.173-.008-.371-.01-.569-.01-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.478 0 1.462 1.065 2.874 1.213 3.072.148.198 2.096 3.2 5.078 4.488.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.75-.715 1.996-1.406.247-.69.247-1.283.173-1.406-.074-.124-.272-.198-.568-.347Z"/>
      </svg>
    </a>
  )
}

/* ═══════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════ */
export default function App() {
  const [currency, setCurrency] = useState('PKR')

  return (
    <div className="site">
      <BackgroundCanvas />

      {/* ══ NAVBAR ══ */}
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">
            <svg viewBox="0 0 38 38" fill="none">
              <polygon points="19,3 35,32 3,32"
                stroke="#00d4ff" strokeWidth="1.6" fill="rgba(0,212,255,0.07)" />
              <polygon points="19,11 29,30 9,30"
                stroke="#a855f7" strokeWidth="1.1" fill="rgba(168,85,247,0.07)" />
              <circle cx="19" cy="19" r="2.4" fill="#00d4ff" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">AR</span>
            <span className="brand-slash"> // </span>
            <span className="brand-sub">LABS</span>
          </div>
        </div>

        <div className="nav-links">
          {[
            { label: 'HOME',     href: '#' },
            { label: 'PRODUCTS', href: '#products' },
            { label: 'BLOG',     href: '#blog' },
          ].map((l, i) => (
            <a key={l.label} href={l.href}
               className={`nav-link${i===0?' active':''}`}>{l.label}</a>
          ))}
          <CurrencySwitcher currency={currency} setCurrency={setCurrency} />
          <button className="nav-search" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="hero">
        <div className="hero-text">
          <motion.h1 className="hero-heading"
            initial={{ opacity:0, x:-36 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:0.75 }}>
            AR LABS:<br />INTELLIGENCE<br />REDEFINED
          </motion.h1>

          <motion.p className="hero-sub"
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            transition={{ delay:0.38, duration:0.65 }}>
            Empower your business with cutting-edge augmented
            intelligence, neural processing, and automated AI tools.
          </motion.p>

          <motion.div className="hero-btns"
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.65, duration:0.55 }}>
            <button className="btn-demo">REQUEST DEMO</button>
          </motion.div>
        </div>

        {/* 2D canvas globe — no Three.js, pixel-perfect control */}
        <div className="hero-globe" aria-hidden>
          <GlobeCanvas />
        </div>
      </section>

      {/* ══ PRODUCTS ══ */}
      <section className="features" id="products">
        <motion.h2 className="features-label"
          initial={{ opacity:0 }} whileInView={{ opacity:1 }}
          viewport={{ once:true }} transition={{ duration:0.55 }}>
          products
        </motion.h2>
        <div className="features-grid">
          <ProductCard currency={currency} />
          {ICON_PRODUCTS.map((p,i) => <IconProductCard key={p.title} {...p} currency={currency} index={i} />)}
          {FEATURES.map((f,i) => <FeatureCard key={f.title} {...f} index={i} />)}
        </div>
      </section>

      {/* ══ BLOG ══ */}
      <section className="features" id="blog">
        <motion.h2 className="features-label"
          initial={{ opacity:0 }} whileInView={{ opacity:1 }}
          viewport={{ once:true }} transition={{ duration:0.55 }}>
          blog
        </motion.h2>
        <div className="features-grid">
          {BLOG_POSTS.map((p,i) => <BlogCard key={p.title} {...p} index={i} />)}
        </div>
      </section>

      <footer className="site-footer">
        <span className="footer-brand">AR // LABS</span>
        <span className="footer-copy">© 2025 AR Labs Inc. All rights reserved.</span>
      </footer>

      <WhatsAppButton />
    </div>
  )
}
