import { motion } from 'framer-motion'
import Seo from '../components/Seo'

export default function Status() {
  return (
    <>
      <Seo path="/status" title="Status" description="AR Labs site status." />
      <section className="static-page status-page">
        <motion.h1 className="static-title" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          Status
        </motion.h1>
        <motion.div className="status-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <span className="status-dot" aria-hidden />
          <div>
            <div className="status-headline">Site is up</div>
            <p className="status-desc">
              This page is a static placeholder, not a live monitor — there's no uptime/incident tracking wired up
              yet, since that needs a real monitoring service. If something's actually broken, the fastest way to
              reach us is still WhatsApp.
            </p>
          </div>
        </motion.div>
      </section>
    </>
  )
}
