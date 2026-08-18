import { NavLink } from 'react-router-dom'
import CurrencySwitcher from './CurrencySwitcher'
import SiteSearch from './SiteSearch'

const NAV_LINKS = [
  { label: 'HOME',     to: '/' },
  { label: 'PRODUCTS', to: '/#products' },
  { label: 'PRICING',  to: '/pricing' },
  { label: 'BLOG',     to: '/blog' },
]

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">
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
      </NavLink>

      <div className="nav-links">
        {NAV_LINKS.map((l) => (
          <NavLink
            key={l.label}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {l.label}
          </NavLink>
        ))}
        <CurrencySwitcher />
        <SiteSearch />
      </div>
    </nav>
  )
}
