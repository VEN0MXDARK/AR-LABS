import { motion } from 'framer-motion'
import Seo from '../../components/Seo'
import BlogCard from '../../components/cards/BlogCard'
import { BLOG_POSTS } from '../../data/blog'

export default function BlogIndex() {
  return (
    <>
      <Seo path="/blog" title="Blog" description="Notes on automation, WhatsApp CRM, and building AI tools, from AR Labs." />
      <section className="static-page">
        <motion.h1 className="static-title" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          Blog
        </motion.h1>
        <p className="static-lede">{BLOG_POSTS.length} posts so far.</p>
        <div className="features-grid">
          {BLOG_POSTS.map((post, i) => <BlogCard key={post.slug} post={post} index={i} />)}
        </div>
      </section>
    </>
  )
}
