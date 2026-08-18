import { motion } from 'framer-motion'
import Seo from '../components/Seo'

const TERMS = [
  { term: 'CRM', def: 'Customer Relationship Management — software that tracks leads and customers through a sales pipeline, from first contact to closed deal.' },
  { term: 'LLM', def: 'Large Language Model — the type of AI model behind modern chatbots and text generation, trained on large amounts of text to predict and generate language.' },
  { term: 'Local / On-device AI', def: 'An AI model that runs entirely on your own hardware instead of a remote server, so the data you give it never has to leave your device.' },
  { term: 'Web Scraping', def: 'Automatically extracting data from websites — turning a page built for humans to read into structured data a system can use.' },
  { term: 'Automation / Workflow Automation', def: 'Connecting steps that used to require a person to trigger manually, so data moves between tools on its own.' },
  { term: 'Lead', def: 'A person or business that has shown interest and could become a paying customer — the raw material a CRM organizes.' },
  { term: 'Pipeline', def: 'The stages a lead moves through on the way to becoming a customer — e.g. contacted → qualified → negotiating → closed.' },
  { term: 'API', def: 'Application Programming Interface — a defined way for two pieces of software to exchange data with each other.' },
  { term: 'Structured data', def: 'Information organized into a consistent, predictable format (like fields in a spreadsheet) rather than free-form text.' },
]

export default function Glossary() {
  return (
    <>
      <Seo path="/glossary" title="Glossary" description="Plain-language definitions for the AI and CRM terms used across the AR Labs site." />
      <section className="static-page">
        <motion.h1 className="static-title" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          Glossary
        </motion.h1>
        <p className="static-lede">Plain-language definitions for terms used elsewhere on this site.</p>
        <dl className="glossary-list">
          {TERMS.map((t, i) => (
            <motion.div key={t.term} className="glossary-item"
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.04 }}>
              <dt className="glossary-term">{t.term}</dt>
              <dd className="glossary-def">{t.def}</dd>
            </motion.div>
          ))}
        </dl>
      </section>
    </>
  )
}
