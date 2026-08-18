import { NavLink } from 'react-router-dom'
import { WHATSAPP_LINK } from '../lib/whatsapp'

const TABS = [
  {
    label: 'Home', to: '/', end: true,
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>,
  },
  {
    label: 'Products', to: '/#products',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  },
  {
    label: 'Blog', to: '/blog',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>,
  },
]

export default function MobileTabBar() {
  return (
    <nav className="mobile-tabbar" aria-label="Mobile navigation">
      {TABS.map((t) => (
        <NavLink key={t.label} to={t.to} end={t.end}
          className={({ isActive }) => `mobile-tab${isActive ? ' active' : ''}`}>
          {t.icon}
          <span>{t.label}</span>
        </NavLink>
      ))}
      <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="mobile-tab mobile-tab-chat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        <span>Chat</span>
      </a>
    </nav>
  )
}
