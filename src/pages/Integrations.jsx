import { motion } from 'framer-motion'
import Seo from '../components/Seo'

/* Categories, not named partners — no specific integration exists yet to
   claim, and listing real brand logos here would be premature. */
const CATEGORIES = [
  { title: 'CRM & Sales', desc: 'Where structured leads from WhatsApp CRM can land once you tell us where you already track deals.' },
  { title: 'Spreadsheets & Storage', desc: 'A destination for Web Scraper output that fits how your team already stores data.' },
  { title: 'Messaging', desc: 'WhatsApp is the core today — other channels are a conversation away if you need them.' },
  { title: 'Automation Platforms', desc: 'Automation Hub is built to be one node in a bigger workflow, not a closed system.' },
]

export default function Integrations() {
  return (
    <>
      <Seo path="/integrations" title="Integrations" description="Where AR Labs' products fit into the tools your business already uses." />
      <section className="static-page">
        <motion.h1 className="static-title" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          Integrations
        </motion.h1>
        <p className="static-lede">
          No named integration partners yet — this page names the categories AR Labs is built to fit into.
          If you use something specific, ask over WhatsApp and we'll tell you honestly whether it fits today.
        </p>
        <div className="features-grid">
          {CATEGORIES.map((c, i) => (
            <motion.div key={c.title} className="feat-card"
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.08 }}>
              <h3 className="feat-title">{c.title.toUpperCase()}</h3>
              <p className="feat-desc">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}
