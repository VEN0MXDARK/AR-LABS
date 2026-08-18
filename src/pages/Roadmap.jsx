import { motion } from 'framer-motion'
import Seo from '../components/Seo'
import { ROADMAP } from '../data/roadmap'

export default function Roadmap() {
  const total = ROADMAP.reduce((n, c) => n + c.items.length, 0)
  const done = ROADMAP.reduce((n, c) => n + c.items.filter((it) => it[2] === 'done').length, 0)

  return (
    <>
      <Seo path="/roadmap" title="Roadmap" description="The public AR Labs site roadmap — what's shipped and what's still ahead." />
      <section className="static-page">
        <motion.h1 className="static-title" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          Roadmap
        </motion.h1>
        <p className="static-lede">{done} of {total} items shipped so far. Not a promise of order — just what's done and what's next.</p>
        <div className="roadmap-list">
          {ROADMAP.map((cat, ci) => (
            <details key={cat.title} className="roadmap-cat" open={ci === 0}>
              <summary className="roadmap-cat-head">
                <span className="roadmap-cat-title">{cat.title}</span>
                <span className="roadmap-cat-count">{cat.items.filter((it) => it[2] === 'done').length}/{cat.items.length}</span>
              </summary>
              <div className="roadmap-cat-body">
                {cat.items.map(([title, desc, status]) => (
                  <div key={title} className="roadmap-item">
                    <div>
                      <div className="roadmap-item-title">{title}</div>
                      <div className="roadmap-item-desc">{desc}</div>
                    </div>
                    <span className={`roadmap-status roadmap-status-${status}`}>{status === 'done' ? 'Shipped' : 'Not yet'}</span>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
