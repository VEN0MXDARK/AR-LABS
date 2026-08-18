import { useState } from 'react'
import { Link } from 'react-router-dom'

const KEY = 'ar-labs-cookie-consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => !window.localStorage.getItem(KEY))

  const choose = (value) => {
    window.localStorage.setItem(KEY, value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie notice">
      <p className="cookie-copy">
        This site doesn't run analytics or tracking yet. If that changes, this notice will ask again — for now it's
        just here so the preference exists. <Link to="/privacy">Privacy Policy</Link>
      </p>
      <div className="cookie-actions">
        <button className="cookie-btn cookie-btn-ghost" onClick={() => choose('declined')}>Decline</button>
        <button className="cookie-btn" onClick={() => choose('accepted')}>Accept</button>
      </div>
    </div>
  )
}
