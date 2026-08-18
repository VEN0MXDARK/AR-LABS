import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePerfTier } from '../../hooks/usePerfTier'
import { useTilt3D } from '../../hooks/useTilt3D'
import { useCurrency } from '../../context/CurrencyContext'
import { formatPrice } from '../../lib/currency'
import { PRODUCT_ICONS } from '../icons/ProductIcons'

export default function IconProductCard({ product, index = 0 }) {
  const { reducedMotion } = usePerfTier()
  const tilt = useTilt3D()
  const { currency } = useCurrency()

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
      <Link to={`/products/${product.slug}`} className="card-hit-area" aria-label={product.title}>
        <div className="feat-icon" style={{ color: product.color }}>{PRODUCT_ICONS[product.iconKey]}</div>
        <h3 className="feat-title">{product.title.toUpperCase()}</h3>
        <p className="feat-desc">{product.desc}</p>
        <div className="price-row">
          {product.priced ? <span className="price-tag">{formatPrice(currency)}</span> : <span />}
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
