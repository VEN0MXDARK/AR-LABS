import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Seo from '../../components/Seo'
import { getProductBySlug } from '../../data/products'
import { BLOG_POSTS } from '../../data/blog'
import { useCurrency } from '../../context/CurrencyContext'
import { formatPrice } from '../../lib/currency'
import { WHATSAPP_LINK } from '../../lib/whatsapp'
import { PRODUCT_ICONS } from '../../components/icons/ProductIcons'

export default function ProductDetail() {
  const { slug } = useParams()
  const product = getProductBySlug(slug)
  const { currency } = useCurrency()

  if (!product) return <Navigate to="/" replace />

  const relatedPost = BLOG_POSTS.find((p) => p.relatedProduct === product.slug)

  return (
    <>
      <Seo path={`/products/${product.slug}`} title={product.title} description={product.desc} />
      <section className="static-page product-detail">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link><span>/</span><Link to="/#products">Products</Link><span>/</span><span aria-current="page">{product.title}</span>
        </nav>

        <motion.div className="product-detail-grid" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="product-detail-media">
            {product.image
              ? <img src={product.image} alt={product.title} className="product-detail-img" />
              : <div className="product-detail-icon" style={{ color: product.color }}>{PRODUCT_ICONS[product.iconKey]}</div>}
          </div>

          <div className="product-detail-body">
            <h1 className="static-title">{product.title}</h1>
            {product.priced && <div className="pricing-amount">{formatPrice(currency)}</div>}
            <p className="static-lede">{product.longDesc}</p>

            <ul className="product-feature-list">
              {product.features.map((f) => (
                <li key={f}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>
                  {f}
                </li>
              ))}
            </ul>

            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="btn-demo">
              {product.priced ? 'CHAT ON WHATSAPP' : 'ASK ABOUT THIS'}
            </a>

            {relatedPost && (
              <p className="related-product-callout">
                Read more: <Link to={`/blog/${relatedPost.slug}`}>{relatedPost.title}</Link>
              </p>
            )}
          </div>
        </motion.div>
      </section>
    </>
  )
}
