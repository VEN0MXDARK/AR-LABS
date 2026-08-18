import { useRef, useEffect, useState, lazy, Suspense } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import './index.css'
import whatsappCrmImg from './assets/whatsapp-crm.jpg'
import { usePerfTier } from './hooks/usePerfTier'
import { useTilt3D } from './hooks/useTilt3D'

const HeroGlobe = lazy(() => import('./three/HeroGlobe.jsx'))

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
  const { reducedMotion } = usePerfTier()
  const tilt = useTilt3D()
  return (
    <motion.div
      className="feat-card"
      style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 22, rotateX: reducedMotion ? 0 : -8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.48, delay: index * 0.10 }}
      {...tilt.handlers}
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
  const { reducedMotion } = usePerfTier()
  const tilt = useTilt3D()
  return (
    <motion.a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="product-card"
      style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 22, rotateX: reducedMotion ? 0 : -8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true }}
      transition={{ duration: 0.48 }}
      {...tilt.handlers}
    >
      <div className="product-media">
        <motion.img
          src={whatsappCrmImg} alt="WhatsApp CRM" className="product-img"
          style={{ x: tilt.driftX, y: tilt.driftY }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />
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
  const { reducedMotion } = usePerfTier()
  const tilt = useTilt3D()
  return (
    <motion.a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="feat-card linkable"
      style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 22, rotateX: reducedMotion ? 0 : -8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true }}
      transition={{ duration: 0.48, delay: index * 0.10 }}
      {...tilt.handlers}
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
  const { reducedMotion } = usePerfTier()
  const tilt = useTilt3D()
  return (
    <motion.div
      className="feat-card"
      style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 22, rotateX: reducedMotion ? 0 : -8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.48, delay: index * 0.10 }}
      {...tilt.handlers}
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
  const { reducedMotion } = usePerfTier()
  return (
    <motion.a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab"
      aria-label="Chat on WhatsApp"
      animate={reducedMotion ? undefined : { y: [0, -6, 0] }}
      transition={reducedMotion ? undefined : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ scale: 1.08, rotate: -6 }}
      whileTap={{ scale: 0.94 }}
    >
      {!reducedMotion && <span className="whatsapp-ping" aria-hidden />}
      <svg viewBox="0 0 32 32" fill="currentColor">
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.66 4.523 1.804 6.383L4 29l7.805-1.77A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.818a9.78 9.78 0 0 1-4.99-1.365l-.358-.213-4.632 1.05 1.04-4.512-.234-.37A9.77 9.77 0 0 1 6.182 15c0-5.415 4.407-9.818 9.822-9.818S25.818 9.585 25.818 15 21.42 24.818 16.004 24.818Zm5.4-7.34c-.296-.148-1.75-.864-2.02-.963-.272-.099-.47-.148-.667.148-.198.297-.766.963-.94 1.161-.173.198-.346.223-.642.075-.297-.148-1.253-.462-2.386-1.472-.882-.787-1.478-1.76-1.651-2.057-.173-.297-.018-.457.13-.605.134-.133.297-.347.445-.52.148-.174.198-.297.297-.495.099-.198.05-.372-.025-.52-.074-.148-.667-1.607-.914-2.202-.24-.579-.484-.5-.667-.51-.173-.008-.371-.01-.569-.01-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.478 0 1.462 1.065 2.874 1.213 3.072.148.198 2.096 3.2 5.078 4.488.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.75-.715 1.996-1.406.247-.69.247-1.283.173-1.406-.074-.124-.272-.198-.568-.347Z"/>
      </svg>
    </motion.a>
  )
}

/* ═══════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════ */
export default function App() {
  const [currency, setCurrency] = useState('PKR')
  const { reducedMotion } = usePerfTier()

  /* Cursor-driven ambient page spotlight — CSS vars, not React state, to avoid a re-render per mousemove. */
  useEffect(() => {
    if (reducedMotion) return
    const onMove = (e) => {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`)
      document.documentElement.style.setProperty('--my', `${e.clientY}px`)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [reducedMotion])

  /* Scroll-linked hero exit, fading/shrinking as the user scrolls toward products. */
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, reducedMotion ? 1 : 0.35])
  const heroScale   = useTransform(scrollYProgress, [0, 1], [1, reducedMotion ? 1 : 0.94])

  return (
    <div className="site">
      <BackgroundCanvas />
      {!reducedMotion && <div className="cursor-glow" aria-hidden />}

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
      <motion.section className="hero" ref={heroRef} style={{ opacity: heroOpacity, scale: heroScale }}>
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

        {/* Real Three.js/R3F scene — lazy-loaded so it doesn't block hero text paint */}
        <div className="hero-globe" aria-hidden>
          <Suspense fallback={<div className="hero-globe-placeholder" />}>
            <HeroGlobe />
          </Suspense>
        </div>
      </motion.section>

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
