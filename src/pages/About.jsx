import { motion } from 'framer-motion'
import Seo from '../components/Seo'

export default function About() {
  return (
    <>
      <Seo path="/about" title="About" description="Why AR Labs builds AI tools around WhatsApp — the place small businesses already run their sales." />
      <section className="static-page">
        <motion.h1 className="static-title" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          About AR Labs
        </motion.h1>
        <div className="static-body">
          <p>
            Most business tools ask you to change how you work in order to use them. AR Labs starts from the
            opposite assumption: a huge amount of real business already happens inside WhatsApp — the sales
            conversation, the follow-up, the "yes, send me the invoice" — and the tools should meet that, not
            replace it.
          </p>
          <p>
            WhatsApp CRM, Web Scraper, and Local LLM AI all follow the same rule: automate the part that's tedious
            (typing, copying, chasing data by hand), and leave the part that actually needs a person — the
            conversation — alone.
          </p>
          <div className="todo-block">
            <span className="todo-label">TODO</span>
            <p>Team bios and photos go here once you're ready to share them.</p>
          </div>
        </div>
      </section>
    </>
  )
}
