import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePerfTier } from '../../hooks/usePerfTier'
import { useTilt3D } from '../../hooks/useTilt3D'
import { formatBlogDate } from '../../lib/date'

export default function BlogCard({ post, index = 0 }) {
  const { reducedMotion } = usePerfTier()
  const tilt = useTilt3D()

  return (
    <motion.div
      className="feat-card linkable"
      style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 22, rotateX: reducedMotion ? 0 : -8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true }}
      transition={{ duration: 0.48, delay: index * 0.10 }}
      {...tilt.handlers}
    >
      <Link to={`/blog/${post.slug}`} className="card-hit-area">
        <span className="blog-date">{formatBlogDate(post.date)}</span>
        <h3 className="feat-title">{post.title}</h3>
        <p className="feat-desc">{post.desc}</p>
      </Link>
    </motion.div>
  )
}
