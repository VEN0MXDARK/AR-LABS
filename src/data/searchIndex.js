import { PRODUCTS } from './products'
import { BLOG_POSTS } from './blog'

const PAGES = [
  { label: 'Home', path: '/', type: 'Page' },
  { label: 'Pricing', path: '/pricing', type: 'Page' },
  { label: 'About', path: '/about', type: 'Page' },
  { label: 'FAQ', path: '/faq', type: 'Page' },
  { label: 'Blog', path: '/blog', type: 'Page' },
  { label: 'Integrations', path: '/integrations', type: 'Page' },
  { label: 'Changelog', path: '/changelog', type: 'Page' },
  { label: 'Glossary', path: '/glossary', type: 'Page' },
  { label: 'Roadmap', path: '/roadmap', type: 'Page' },
  { label: 'Status', path: '/status', type: 'Page' },
  { label: 'Privacy Policy', path: '/privacy', type: 'Page' },
]

export function buildSearchIndex() {
  return [
    ...PAGES,
    ...PRODUCTS.map((p) => ({ label: p.title, path: `/products/${p.slug}`, type: 'Product' })),
    ...BLOG_POSTS.map((p) => ({ label: p.title, path: `/blog/${p.slug}`, type: 'Blog' })),
  ]
}
