import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Seo from '../../components/Seo'
import { BLOG_POSTS, getPostBySlug } from '../../data/blog'
import { getProductBySlug } from '../../data/products'
import { formatBlogDate } from '../../lib/date'

function ShareButtons({ title }) {
  const [url] = useState(() => window.location.href)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* clipboard not available — no-op */ }
  }

  return (
    <div className="share-row">
      <span className="share-label">Share</span>
      <a className="share-btn" target="_blank" rel="noopener noreferrer"
         href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
         aria-label="Share on X">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-7.2L4.4 22H1.3l8.1-9.3L.9 2h7.2l5 6.6L18.9 2Zm-1.2 18h1.7L6.4 4H4.6l13.1 16Z"/></svg>
      </a>
      <a className="share-btn" target="_blank" rel="noopener noreferrer"
         href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`}
         aria-label="Share on WhatsApp">
        <svg viewBox="0 0 32 32" fill="currentColor">
          <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.66 4.523 1.804 6.383L4 29l7.805-1.77A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.818a9.78 9.78 0 0 1-4.99-1.365l-.358-.213-4.632 1.05 1.04-4.512-.234-.37A9.77 9.77 0 0 1 6.182 15c0-5.415 4.407-9.818 9.822-9.818S25.818 9.585 25.818 15 21.42 24.818 16.004 24.818Zm5.4-7.34c-.296-.148-1.75-.864-2.02-.963-.272-.099-.47-.148-.667.148-.198.297-.766.963-.94 1.161-.173.198-.346.223-.642.075-.297-.148-1.253-.462-2.386-1.472-.882-.787-1.478-1.76-1.651-2.057-.173-.297-.018-.457.13-.605.134-.133.297-.347.445-.52.148-.174.198-.297.297-.495.099-.198.05-.372-.025-.52-.074-.148-.667-1.607-.914-2.202-.24-.579-.484-.5-.667-.51-.173-.008-.371-.01-.569-.01-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.478 0 1.462 1.065 2.874 1.213 3.072.148.198 2.096 3.2 5.078 4.488.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.75-.715 1.996-1.406.247-.69.247-1.283.173-1.406-.074-.124-.272-.198-.568-.347Z"/>
        </svg>
      </a>
      <button className="share-btn" onClick={copy} aria-label="Copy link">
        {copied
          ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>
          : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>}
      </button>
    </div>
  )
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) return <Navigate to="/blog" replace />

  const relatedProduct = post.relatedProduct ? getProductBySlug(post.relatedProduct) : null
  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
    <>
      <Seo path={`/blog/${post.slug}`} title={post.title} description={post.desc} />
      <article className="static-page blog-post">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link><span>/</span><Link to="/blog">Blog</Link><span>/</span><span aria-current="page">{post.title}</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="blog-date">{formatBlogDate(post.date)}</span>
          <h1 className="static-title">{post.title}</h1>
          <p className="blog-byline">By AR Labs Team</p>

          <div className="static-body">
            {post.body.map((para, i) => <p key={i}>{para}</p>)}
          </div>

          {relatedProduct && (
            <div className="related-product-callout">
              Mentioned above: <Link to={`/products/${relatedProduct.slug}`}>{relatedProduct.title}</Link>
            </div>
          )}

          <ShareButtons title={post.title} />
        </motion.div>

        {otherPosts.length > 0 && (
          <div className="related-posts">
            <h2 className="static-subtitle">More posts</h2>
            <ul>
              {otherPosts.map((p) => (
                <li key={p.slug}><Link to={`/blog/${p.slug}`}>{p.title}</Link></li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </>
  )
}
