import { motion } from 'framer-motion'
import { usePerfTier } from '../../hooks/usePerfTier'
import { useTilt3D } from '../../hooks/useTilt3D'

function StarRow({ rating }) {
  return (
    <div className="stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill={i < rating ? '#ffb020' : 'none'} stroke="#ffb020" strokeWidth="1.2">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5Z"/>
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialCard({ quote, role, rating, index = 0 }) {
  const { reducedMotion } = usePerfTier()
  const tilt = useTilt3D()
  return (
    <motion.div
      className="feat-card testimonial-card"
      style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 22, rotateX: reducedMotion ? 0 : -8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.48, delay: index * 0.10 }}
      {...tilt.handlers}
    >
      <StarRow rating={rating} />
      <p className="testimonial-quote">"{quote}"</p>
      <span className="testimonial-role">{role}</span>
    </motion.div>
  )
}
