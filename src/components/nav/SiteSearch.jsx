import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { buildSearchIndex } from '../../data/searchIndex'

export default function SiteSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapRef = useRef()
  const inputRef = useRef()
  const navigate = useNavigate()
  const index = useMemo(() => buildSearchIndex(), [])

  const results = query.trim()
    ? index.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 8)
    : []

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    const onClick = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open])

  const go = (path) => {
    navigate(path)
    setOpen(false)
    setQuery('')
  }

  return (
    <div className="site-search" ref={wrapRef}>
      <button className="nav-search" aria-label="Search the site" onClick={() => setOpen(o => !o)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </button>
      {open && (
        <div className="search-panel">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search pages, products, blog…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query.trim() !== '' && (
            <ul className="search-results" role="listbox">
              {results.length === 0 && <li className="search-empty">No matches for "{query}"</li>}
              {results.map((r) => (
                <li key={r.path}>
                  <button className="search-result" onClick={() => go(r.path)}>
                    <span className="search-result-label">{r.label}</span>
                    <span className="search-result-type">{r.type}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
