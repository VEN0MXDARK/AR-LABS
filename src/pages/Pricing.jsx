import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Seo from '../components/Seo'
import { PRODUCTS } from '../data/products'
import { useCurrency } from '../context/CurrencyContext'
import { formatPrice } from '../lib/currency'
import CurrencySwitcher from '../components/nav/CurrencySwitcher'

export default function Pricing() {
  const { currency } = useCurrency()
  const priced = PRODUCTS.filter((p) => p.priced)
  const unpriced = PRODUCTS.filter((p) => !p.priced)

  return (
    <>
      <Seo path="/pricing" title="Pricing" description="AR Labs product pricing — WhatsApp CRM, Web Scraper, and Local LLM AI, compared side by side." />
      <section className="static-page pricing-page">
        <motion.h1 className="static-title" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          Pricing
        </motion.h1>
        <p className="static-lede">
          One price per product today — no bundled tiers yet, those need pricing decided before they're listed here.
          Prices shown in <strong>{currency}</strong>; switch currency in the nav or right here.
        </p>
        <div className="pricing-currency"><CurrencySwitcher /></div>

        <div className="pricing-cards">
          {priced.map((p, i) => (
            <motion.div key={p.slug} className="pricing-card"
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.08 }}>
              <h3 className="feat-title">{p.title.toUpperCase()}</h3>
              <div className="pricing-amount">{formatPrice(currency)}</div>
              <p className="feat-desc">{p.desc}</p>
              <Link to={`/products/${p.slug}`} className="btn-demo">VIEW DETAILS</Link>
            </motion.div>
          ))}
        </div>

        <h2 className="static-subtitle">Compare all products</h2>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Key feature</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((p) => (
                <tr key={p.slug}>
                  <td><Link to={`/products/${p.slug}`}>{p.title}</Link></td>
                  <td>{p.priced ? formatPrice(currency) : 'Included with plan'}</td>
                  <td>{p.features[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {unpriced.length > 0 && (
          <p className="static-lede pricing-footnote">
            {unpriced.map((p) => p.title).join(' and ')} aren't sold standalone yet — ask about them when you reach
            out about a priced product.
          </p>
        )}
      </section>
    </>
  )
}
