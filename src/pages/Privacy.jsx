import { motion } from 'framer-motion'
import Seo from '../components/Seo'

const SECTIONS = [
  'What information we collect',
  'How WhatsApp conversation data is used',
  'How long data is retained',
  'Third parties data is shared with, if any',
  'How to request deletion of your data',
  'How to contact us about privacy',
]

export default function Privacy() {
  return (
    <>
      <Seo path="/privacy" title="Privacy Policy" description="How AR Labs handles data from WhatsApp conversations and this website." />
      <section className="static-page">
        <motion.h1 className="static-title" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          Privacy Policy
        </motion.h1>
        <div className="todo-block">
          <span className="todo-label">TODO — not yet legally reviewed</span>
          <p>
            This page is a placeholder structure, not real legal text. Replace the sections below with an actual
            privacy policy — ideally reviewed by someone qualified to write one for a business handling WhatsApp
            conversation data — before this site is treated as production-ready.
          </p>
        </div>
        <div className="static-body">
          {SECTIONS.map((s) => (
            <div key={s} className="privacy-section">
              <h2 className="privacy-heading">{s}</h2>
              <p className="privacy-placeholder">[ Placeholder — add real content here. ]</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
