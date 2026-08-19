import whatsappCrmImg from '../assets/whatsapp-crm.jpg'
import webScraperImg from '../assets/web-scraper.jpg'
import localLlmAiImg from '../assets/local-llm-ai.jpg'

/* icon/image + short desc match what's already said elsewhere on the site —
   longDesc and features expand on that without inventing new claims. */
export const PRODUCTS = [
  {
    slug: 'whatsapp-crm',
    title: 'WhatsApp CRM',
    desc: 'Turn WhatsApp conversations into structured leads, straight into your pipeline.',
    longDesc:
      'WhatsApp CRM watches your business conversations and turns them into structured records — ' +
      'names, numbers, intent, and follow-up status — without anyone on your team re-typing a thing. ' +
      'Built for teams that already close deals over WhatsApp and are tired of losing context in a chat thread.',
    image: whatsappCrmImg,
    color: '#22cc88',
    priced: true,
    features: [
      'Extracts structured leads directly from WhatsApp conversations',
      'Feeds straight into your existing sales pipeline',
      'No manual data entry between chat and CRM',
    ],
  },
  {
    slug: 'web-scraper',
    title: 'Web Scraper',
    desc: 'Automated data extraction from any website, delivered clean and structured.',
    longDesc:
      'Point Web Scraper at a site and get back clean, structured data instead of raw HTML — ' +
      'built for teams who need a steady feed of external data without maintaining scraping scripts by hand.',
    image: webScraperImg,
    color: '#22cc88',
    priced: true,
    features: [
      'Automated extraction from any website',
      'Delivers clean, structured output',
      'No scraping scripts to write or maintain',
    ],
  },
  {
    slug: 'local-llm-ai',
    title: 'Local LLM AI',
    desc: 'Your own private AI model, running locally — no cloud, no data leaves your device.',
    longDesc:
      'Local LLM AI runs entirely on your own hardware. Nothing you feed it leaves your device, ' +
      'which matters if your data — customer conversations, internal documents, anything sensitive — ' +
      'can\'t sit on someone else\'s server.',
    image: localLlmAiImg,
    color: '#00d4aa',
    priced: true,
    features: [
      'Runs locally — no cloud dependency',
      'No data ever leaves your device',
      'Private by design, not by policy',
    ],
  },
  {
    slug: 'automation-hub',
    title: 'Automation Hub',
    desc: 'Streamline workflows with powerful automation tools.',
    longDesc:
      'Automation Hub connects the repetitive parts of your workflow so they run themselves — ' +
      'built to sit alongside WhatsApp CRM and Web Scraper as the layer that moves data between them.',
    iconKey: 'automation',
    color: '#a855f7',
    priced: false,
    features: [
      'Streamlines multi-step workflows',
      'Works alongside AR Labs\' other tools',
      'Reduces manual handoffs between systems',
    ],
  },
  {
    slug: 'data-analytics',
    title: 'Data Analytics',
    desc: 'Real-time insights and customizable reporting.',
    longDesc:
      'Data Analytics turns whatever AR Labs collects for you — leads, scraped data, automation logs — ' +
      'into real-time insight, with reporting you can shape around what your team actually needs to see.',
    iconKey: 'analytics',
    color: '#00aaff',
    priced: false,
    features: [
      'Real-time insights, not batch reports',
      'Customizable to what your team tracks',
      'Draws on data from your other AR Labs tools',
    ],
  },
]

export function getProductBySlug(slug) {
  return PRODUCTS.find((p) => p.slug === slug)
}
