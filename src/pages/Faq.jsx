import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

const FAQS = [
  {
    q: 'How does WhatsApp CRM actually get data out of a chat?',
    a: 'It reads business conversations you\'re already having and pulls out structured fields — name, number, ' +
       'stated intent, follow-up status — so they land in your pipeline without anyone retyping them.',
  },
  {
    q: 'Do I need to change how my team already sells on WhatsApp?',
    a: 'No. The tools sit alongside your existing conversations rather than replacing them — you keep chatting the ' +
       'way you already do, the structured record is the part that\'s new.',
  },
  {
    q: 'Is Local LLM AI really fully offline?',
    a: 'Yes — it runs on your own hardware, and nothing you feed it is sent anywhere else. That\'s the entire point ' +
       'of the product: private by design, not by a policy someone could change later.',
  },
  {
    q: 'What happens after I click "Chat on WhatsApp" or send the contact form?',
    a: 'It opens a WhatsApp conversation with AR Labs, pre-filled with what you entered. Everything from there is a ' +
       'real conversation with a person — there\'s no automated checkout behind it yet.',
  },
  {
    q: 'Can I pay in a currency other than PKR?',
    a: 'The currency switcher in the navbar converts the displayed price for reference, but the actual base price ' +
       'and any payment arrangement happens over WhatsApp once you reach out.',
  },
  {
    q: 'Do you offer refunds or a trial?',
    a: 'That\'s worth asking directly — terms depend on which product and what you need, so it\'s a WhatsApp ' +
       'conversation rather than a fixed policy listed here.',
  },
]

export default function Faq() {
  return (
    <>
      <Seo path="/faq" title="FAQ" description="Answers to common questions about AR Labs' WhatsApp CRM, Web Scraper, and Local LLM AI products." />
      <section className="static-page">
        <motion.h1 className="static-title" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          Frequently Asked Questions
        </motion.h1>
        <p className="static-lede">Still have something specific? <Link to="/#contact">Send it our way</Link> and we'll answer directly.</p>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <motion.details key={f.q} className="faq-item"
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}>
              <summary className="faq-question">
                {f.q}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>
              </summary>
              <p className="faq-answer">{f.a}</p>
            </motion.details>
          ))}
        </div>
      </section>
    </>
  )
}
