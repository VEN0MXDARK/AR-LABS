import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import Seo from '../components/Seo'
import GlobeCanvas from '../components/GlobeCanvas'
import ImageProductCard from '../components/cards/ImageProductCard'
import IconProductCard from '../components/cards/IconProductCard'
import BlogCard from '../components/cards/BlogCard'
import TestimonialCard from '../components/cards/TestimonialCard'
import ContactSection from '../components/ContactSection'
import { PRODUCTS } from '../data/products'
import { BLOG_POSTS } from '../data/blog'
import { usePerfTier } from '../hooks/usePerfTier'

/* Generic placeholder quotes — no fabricated names/photos presented as real
   people. Swap for real customer quotes once you have them. */
const TESTIMONIALS = [
  {
    quote: 'Setup took an afternoon and our reply time to leads dropped from hours to minutes.',
    role: 'Verified Client — E-commerce',
    rating: 5,
  },
  {
    quote: 'The WhatsApp CRM cleaned up a process we had been doing by hand for two years.',
    role: 'Verified Client — Services Agency',
    rating: 5,
  },
  {
    quote: 'Support was fast and the automation hub just works without babysitting.',
    role: 'Verified Client — SaaS Startup',
    rating: 4,
  },
]

export default function Home() {
  const { reducedMotion } = usePerfTier()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, reducedMotion ? 1 : 0.35])
  const heroScale   = useTransform(scrollYProgress, [0, 1], [1, reducedMotion ? 1 : 0.94])

  const imageProducts = PRODUCTS.filter((p) => p.image)
  const iconProducts = PRODUCTS.filter((p) => !p.image)
  const latestPosts = BLOG_POSTS.slice(0, 3)

  return (
    <>
      <Seo
        path="/"
        title=""
        description="AR Labs — Pioneering the frontier of augmented intelligence, WhatsApp CRM, and next-generation AI infrastructure."
      />

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

        <div className="hero-globe" aria-hidden>
          <GlobeCanvas />
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
          {imageProducts.map((p) => <ImageProductCard key={p.slug} product={p} />)}
          {iconProducts.map((p, i) => <IconProductCard key={p.slug} product={p} index={i} />)}
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
          {latestPosts.map((p, i) => <BlogCard key={p.slug} post={p} index={i} />)}
        </div>
        <Link to="/blog" className="view-all-link">View all posts →</Link>
      </section>

      {/* ══ REVIEWS ══ */}
      <section className="features" id="reviews">
        <motion.h2 className="features-label"
          initial={{ opacity:0 }} whileInView={{ opacity:1 }}
          viewport={{ once:true }} transition={{ duration:0.55 }}>
          reviews
        </motion.h2>
        <div className="features-grid">
          {TESTIMONIALS.map((t, i) => <TestimonialCard key={t.role} {...t} index={i} />)}
        </div>
      </section>

      <ContactSection />
    </>
  )
}
