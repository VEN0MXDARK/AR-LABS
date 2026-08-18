import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Seo from '../components/Seo'

export default function NotFound() {
  return (
    <>
      <Seo path="/404" title="Page Not Found" description="This page doesn't exist on AR Labs." />
      <section className="static-page notfound-page">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="notfound-mark">
            <svg viewBox="0 0 38 38" fill="none">
              <polygon points="19,3 35,32 3,32" stroke="#00d4ff" strokeWidth="1.6" fill="rgba(0,212,255,0.07)" />
              <polygon points="19,11 29,30 9,30" stroke="#a855f7" strokeWidth="1.1" fill="rgba(168,85,247,0.07)" />
              <circle cx="19" cy="19" r="2.4" fill="#00d4ff" />
            </svg>
          </div>
          <h1 className="static-title">404 — Lost signal</h1>
          <p className="static-lede">This page doesn't exist, or it moved. Let's get you back on course.</p>
          <Link to="/" className="btn-demo">BACK TO HOME</Link>
        </motion.div>
      </section>
    </>
  )
}
