import { motion } from 'framer-motion'
import Seo from '../components/Seo'

/* Built from this repo's actual commit history — not invented. */
const ENTRIES = [
  {
    date: '2026-08-18',
    title: 'Site becomes multi-page',
    items: [
      'Added dedicated pages: Pricing, About, FAQ, full Blog index, individual blog posts, individual product pages, Privacy, Integrations, Changelog, Glossary, Roadmap, Status.',
      'Currency selection now persists across pages.',
      'Site search wired up in the navbar.',
    ],
  },
  {
    date: '2026-08-18',
    title: 'Reviews, contact, and a proper loading screen',
    items: [
      'Added a testimonials section and a "Get in Touch" form that routes to WhatsApp.',
      'Added a branded loading screen for first paint.',
      'Reverted the hero globe back to the original 2D canvas version by request.',
    ],
  },
  {
    date: '2026-08-18',
    title: 'Real 3D hero globe (later reverted)',
    items: [
      'Replaced the 2D canvas globe with a Three.js/React Three Fiber scene.',
      'Added card tilt-on-hover, cursor spotlight, and WhatsApp button micro-interactions — these stayed after the globe itself was reverted.',
    ],
  },
  {
    date: '2026-08-18',
    title: 'Initial launch',
    items: [
      'AR Labs site goes live: WhatsApp CRM, Web Scraper, and Local LLM AI products.',
      'Added a blog section and a currency switcher (PKR default).',
      'Deployed to GitHub Pages.',
    ],
  },
]

export default function Changelog() {
  return (
    <>
      <Seo path="/changelog" title="Changelog" description="What's shipped on the AR Labs site, in order." />
      <section className="static-page">
        <motion.h1 className="static-title" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          Changelog
        </motion.h1>
        <p className="static-lede">What's actually shipped on this site, most recent first.</p>
        <div className="changelog-list">
          {ENTRIES.map((e, i) => (
            <motion.div key={e.title} className="changelog-entry"
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}>
              <span className="changelog-date">{e.date}</span>
              <h3 className="changelog-title">{e.title}</h3>
              <ul className="changelog-items">
                {e.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}
