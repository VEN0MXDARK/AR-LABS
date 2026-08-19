import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Seo from '../components/Seo'
import { buildSearchIndex } from '../data/searchIndex'

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/#products' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Blog', to: '/blog' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/#contact' },
]

export default function NotFound() {
  const { pathname } = useLocation()
  const [query, setQuery] = useState('')
  const index = useMemo(() => buildSearchIndex(), [])

  const results = query.trim()
    ? index.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6)
    : []

  return (
    <>
      <Seo path="/404" title="Page Not Found" description="This page doesn't exist on AR Labs." />
      <section className="static-page notfound-page">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="notfound-mark">
            <span className="notfound-mark-ghost" aria-hidden>
              <svg viewBox="0 0 38 38" fill="none">
                <polygon points="19,3 35,32 3,32" stroke="#a855f7" strokeWidth="1.4" />
              </svg>
            </span>
            <svg viewBox="0 0 38 38" fill="none" className="notfound-mark-main">
              <polygon points="19,3 35,32 3,32" stroke="#00d4ff" strokeWidth="1.6" fill="rgba(0,212,255,0.07)" />
              <polygon points="19,11 29,30 9,30" stroke="#a855f7" strokeWidth="1.1" fill="rgba(168,85,247,0.07)" />
              <circle cx="19" cy="19" r="2.4" fill="#00d4ff" />
            </svg>
          </div>

          <h1 className="static-title">404 — Lost Signal</h1>
          <p className="static-lede">
            We couldn't find <code className="notfound-path">{pathname}</code>. It may have moved, or never existed.
          </p>

          <div className="notfound-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              placeholder="Search the site instead…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          {results.length > 0 && (
            <ul className="notfound-results">
              {results.map((r) => (
                <li key={r.path}>
                  <Link to={r.path}>
                    <span>{r.label}</span>
                    <span className="notfound-results-type">{r.type}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {query.trim() !== '' && results.length === 0 && (
            <p className="notfound-noresults">No matches for "{query}" — try one of these instead:</p>
          )}

          <nav className="notfound-links" aria-label="Suggested pages">
            {QUICK_LINKS.map((l) => <Link key={l.to} to={l.to}>{l.label}</Link>)}
          </nav>

          <Link to="/" className="btn-demo notfound-home-btn">BACK TO HOME</Link>
        </motion.div>
      </section>
    </>
  )
}
