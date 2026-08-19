import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import BackgroundCanvas from '../components/BackgroundCanvas'
import Navbar from '../components/nav/Navbar'
import WhatsAppButton from '../components/WhatsAppButton'
import CookieConsent from '../components/CookieConsent'
import StickyCta from '../components/StickyCta'
import MobileTabBar from '../components/MobileTabBar'
import { CurrencyProvider } from '../context/CurrencyContext'
import { usePerfTier } from '../hooks/usePerfTier'

/* React Router doesn't manage scroll position on navigation. Reset to top on
   route change; scroll a #hash target into view when one is present (e.g.
   footer links back to Home's #contact section). */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function SiteLayout() {
  const { reducedMotion } = usePerfTier()

  useEffect(() => {
    if (reducedMotion) return
    const onMove = (e) => {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`)
      document.documentElement.style.setProperty('--my', `${e.clientY}px`)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [reducedMotion])

  return (
    <CurrencyProvider>
      <div className="site">
        <ScrollManager />
        <a href="#main-content" className="skip-link">Skip to content</a>
        <BackgroundCanvas />
        {!reducedMotion && <div className="cursor-glow" aria-hidden />}

        <Navbar />

        <main id="main-content">
          <Outlet />
        </main>

        <footer className="site-footer">
          <div className="footer-main">
            <span className="footer-brand">AR // LABS</span>
            <nav className="footer-links" aria-label="Footer">
              <Link to="/#products">Products</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/pricing">Pricing</Link>
              <Link to="/about">About</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/privacy">Privacy</Link>
            </nav>
            <div className="footer-social" aria-label="Social links (coming soon)">
              {/* TODO: real social URLs not supplied yet — placeholders only */}
              <a href="#" aria-label="AR Labs on X (coming soon)" title="Coming soon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-7.2L4.4 22H1.3l8.1-9.3L.9 2h7.2l5 6.6L18.9 2Zm-1.2 18h1.7L6.4 4H4.6l13.1 16Z"/></svg>
              </a>
              <a href="#" aria-label="AR Labs on LinkedIn (coming soon)" title="Coming soon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.6v1.7h.05c.5-.95 1.75-1.95 3.6-1.95 3.85 0 4.55 2.5 4.55 5.85V21h-4v-5.4c0-1.3-.02-2.95-1.8-2.95-1.8 0-2.1 1.4-2.1 2.85V21h-4V9Z"/></svg>
              </a>
            </div>
          </div>
          <span className="footer-copy">© 2025 AR Labs Inc. All rights reserved.</span>
        </footer>

        <WhatsAppButton />
        <StickyCta />
        <MobileTabBar />
        <CookieConsent />
      </div>
    </CurrencyProvider>
  )
}
