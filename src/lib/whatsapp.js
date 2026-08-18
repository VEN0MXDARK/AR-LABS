const WHATSAPP_CODE = 'HYIOIGP6X36HJ1'

export const WHATSAPP_LINK = `https://wa.me/message/${WHATSAPP_CODE}`

/* wa.me/message/<code> drops query params on redirect — api.whatsapp.com
   doesn't, so prefilled text (contact form) must use this form instead. */
export const whatsappLinkPrefilled = (text) =>
  `https://api.whatsapp.com/message/${WHATSAPP_CODE}?text=${encodeURIComponent(text)}`
