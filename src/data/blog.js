export const BLOG_POSTS = [
  {
    slug: 'why-automation-is-the-future-of-crm',
    date: '2026-08-12',
    title: 'Why Automation Is the Future of CRM',
    desc: 'How neural workflow automation is replacing manual pipeline work for growing sales teams.',
    relatedProduct: 'automation-hub',
    body: [
      'Most CRMs are still built around the assumption that a human will type the data in. Someone finishes a call, ' +
      'opens the CRM, and manually logs what happened. That step is where most pipelines quietly fall apart — not ' +
      'because the CRM is bad, but because logging is the first thing a busy team skips.',
      'Automation removes that step instead of trying to make it faster. When a workflow can watch where a ' +
      'conversation actually happens — a chat thread, an inbox, a form submission — and turn it into a structured ' +
      'record on its own, the CRM stops depending on anyone remembering to update it.',
      'The teams that get the most out of this aren\'t replacing their sales process. They\'re removing the ' +
      'administrative tax on top of it, so the time that used to go into data entry goes into the next conversation ' +
      'instead.',
    ],
  },
  {
    slug: 'whatsapp-data-extraction-boosts-sales',
    date: '2026-07-28',
    title: '5 Ways WhatsApp Data Extraction Boosts Sales',
    desc: 'Turning raw conversation data into structured leads your CRM can actually use.',
    relatedProduct: 'whatsapp-crm',
    body: [
      'A WhatsApp thread is a great place to close a deal and a terrible place to keep records. Names get buried, ' +
      'follow-ups get missed, and by the time a lead is ready to buy, the context that would help you close faster ' +
      'is scattered across dozens of messages.',
      'Structured extraction changes what a conversation is worth to your pipeline: a name and number become a real ' +
      'lead record instead of a contact card; stated intent — "I want the enterprise plan" — becomes a qualified ' +
      'status instead of a sentence you\'ll forget by Friday; a follow-up promise becomes a task with a date attached ' +
      'to it instead of a mental note.',
      'None of this requires changing how your team sells. It just means the conversation you were already having ' +
      'stops evaporating the moment the chat window closes.',
    ],
  },
  {
    slug: 'inside-ar-labs-building-neural-tools',
    date: '2026-07-09',
    title: 'Inside AR Labs: Building Neural Tools',
    desc: 'A behind-the-scenes look at the analytics engine powering our automation hub.',
    relatedProduct: 'data-analytics',
    body: [
      'Automation is only as useful as the visibility you have into what it\'s actually doing. Early on, that was ' +
      'the gap we kept running into: workflows would run fine, but nobody could easily see what changed, what got ' +
      'processed, or where something had quietly stalled.',
      'That\'s the problem Data Analytics was built to close. Instead of a separate reporting tool bolted on ' +
      'afterward, it reads directly from what Automation Hub and the other tools are already doing — so the numbers ' +
      'you see reflect what\'s actually happening in your pipeline, not a snapshot from last night\'s batch job.',
      'The result is closer to a dashboard than a report: something you check because it\'s current, not something ' +
      'you export once a month and hope is still accurate by the time anyone reads it.',
    ],
  },
]

export function getPostBySlug(slug) {
  return BLOG_POSTS.find((p) => p.slug === slug)
}
