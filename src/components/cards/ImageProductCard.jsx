import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePerfTier } from '../../hooks/usePerfTier'
import { useTilt3D } from '../../hooks/useTilt3D'
import { useCurrency } from '../../context/CurrencyContext'
import { formatPrice } from '../../lib/currency'

export default function ImageProductCard({ product }) {
  const { reducedMotion } = usePerfTier()
  const tilt = useTilt3D()
  const { currency } = useCurrency()

  return (
    <motion.div
      className="product-card"
      style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 22, rotateX: reducedMotion ? 0 : -8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true }}
      transition={{ duration: 0.48 }}
      {...tilt.handlers}
    >
      <Link to={`/products/${product.slug}`} className="card-hit-area card-hit-area-block">
        <div className="product-media">
          <motion.img
            src={product.image} alt={product.title} className="product-img" loading="lazy"
            style={{ x: tilt.driftX, y: tilt.driftY }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
          <span className="product-price">{formatPrice(currency)}</span>
        </div>
        <div className="product-body">
          <h3 className="feat-title">{product.title.toUpperCase()}</h3>
          <p className="feat-desc">{product.desc}</p>
          <span className="product-cta">
            Details
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
