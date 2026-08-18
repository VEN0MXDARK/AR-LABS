import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function StickyCta() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(() => window.sessionStorage.getItem('ar-labs-cta-dismissed') === '1')
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  if (dismissed || !visible) return null

  const dismiss = () => {
    window.sessionStorage.setItem('ar-labs-cta-dismissed', '1')
    setDismissed(true)
  }

  return (
    <div className="sticky-cta">
      <span className="sticky-cta-text">Ready to automate your workflow?</span>
      <div className="sticky-cta-actions">
        <button className="btn-demo sticky-cta-btn">REQUEST DEMO</button>
        <button className="sticky-cta-close" aria-label="Dismiss" onClick={dismiss}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  )
}
