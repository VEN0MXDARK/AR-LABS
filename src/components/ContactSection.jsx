import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { whatsappLinkPrefilled } from '../lib/whatsapp'

const DRAFT_KEY = 'ar-labs-contact-draft'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const COOLDOWN_MS = 15000

function readDraft() {
  try {
    return JSON.parse(window.localStorage.getItem(DRAFT_KEY) || '{}')
  } catch {
    return {}
  }
}

export default function ContactSection() {
  /* Draft auto-save — a refresh mid-thought shouldn't lose what was typed. */
  const [email, setEmail] = useState(() => readDraft().email || '')
  const [message, setMessage] = useState(() => readDraft().message || '')
  const [touched, setTouched] = useState(false)
  const [lastSentAt, setLastSentAt] = useState(0)
  const [cooldownLeft, setCooldownLeft] = useState(0)

  useEffect(() => {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ email, message }))
  }, [email, message])

  useEffect(() => {
    if (!lastSentAt) return
    const id = setInterval(() => {
      const left = Math.max(0, COOLDOWN_MS - (Date.now() - lastSentAt))
      setCooldownLeft(left)
      if (left === 0) clearInterval(id)
    }, 500)
    return () => clearInterval(id)
  }, [lastSentAt])

  const emailValid = email.trim() === '' || EMAIL_RE.test(email.trim())
  const canSend = (email.trim() !== '' || message.trim() !== '') && emailValid && cooldownLeft === 0

  const handleSend = (e) => {
    e.preventDefault()
    setTouched(true)
    if (!canSend) return
    const lines = []
    if (email.trim())   lines.push(`Email: ${email.trim()}`)
    if (message.trim()) lines.push(`Message: ${message.trim()}`)
    window.open(whatsappLinkPrefilled(`Hi AR Labs!\n${lines.join('\n')}`), '_blank', 'noopener,noreferrer')
    setEmail(''); setMessage(''); setTouched(false)
    window.localStorage.removeItem(DRAFT_KEY)
    setLastSentAt(Date.now())
    setCooldownLeft(COOLDOWN_MS)
  }

  return (
    <section className="contact" id="contact">
      <motion.h2 className="features-label"
        initial={{ opacity:0 }} whileInView={{ opacity:1 }}
        viewport={{ once:true }} transition={{ duration:0.55 }}>
        get in touch
      </motion.h2>
      <motion.form className="contact-form" onSubmit={handleSend} noValidate
        initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true }} transition={{ duration:0.5 }}>
        <p className="contact-sub">Want updates, or have feedback? Send it straight to our WhatsApp.</p>
        <input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          className="contact-input"
          aria-invalid={touched && !emailValid}
        />
        {touched && !emailValid && <span className="contact-error">That email doesn't look right.</span>}
        <textarea
          placeholder="Your feedback (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="contact-textarea"
          rows={3}
        />
        <button type="submit" className="btn-demo contact-submit" disabled={!canSend}>
          {cooldownLeft > 0 ? `WAIT ${Math.ceil(cooldownLeft / 1000)}S` : 'SEND VIA WHATSAPP'}
        </button>
      </motion.form>
    </section>
  )
}
