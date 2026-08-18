import { useEffect } from 'react'

const SITE_URL = 'https://ven0mxdark.github.io/AR-LABS'
const SITE_NAME = 'AR Labs'

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/* Imperative per-page <title>/meta/canonical — no react-helmet dependency
   needed at this scale. Mount once per page component. */
export default function Seo({ title, description, path = '/' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Next-Gen AI Platform`
    const url = `${SITE_URL}${path === '/' ? '/' : path}`

    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)

    const canonical = document.getElementById('canonical-link')
    if (canonical) canonical.setAttribute('href', url)
  }, [title, description, path])

  return null
}
