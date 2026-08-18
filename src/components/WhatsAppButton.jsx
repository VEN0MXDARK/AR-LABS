import { motion } from 'framer-motion'
import { usePerfTier } from '../hooks/usePerfTier'
import { WHATSAPP_LINK } from '../lib/whatsapp'

export default function WhatsAppButton() {
  const { reducedMotion } = usePerfTier()
  return (
    <motion.a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab"
      aria-label="Chat on WhatsApp"
      animate={reducedMotion ? undefined : { y: [0, -6, 0] }}
      transition={reducedMotion ? undefined : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ scale: 1.08, rotate: -6 }}
      whileTap={{ scale: 0.94 }}
    >
      {!reducedMotion && <span className="whatsapp-ping" aria-hidden />}
      <svg viewBox="0 0 32 32" fill="currentColor">
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.66 4.523 1.804 6.383L4 29l7.805-1.77A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.818a9.78 9.78 0 0 1-4.99-1.365l-.358-.213-4.632 1.05 1.04-4.512-.234-.37A9.77 9.77 0 0 1 6.182 15c0-5.415 4.407-9.818 9.822-9.818S25.818 9.585 25.818 15 21.42 24.818 16.004 24.818Zm5.4-7.34c-.296-.148-1.75-.864-2.02-.963-.272-.099-.47-.148-.667.148-.198.297-.766.963-.94 1.161-.173.198-.346.223-.642.075-.297-.148-1.253-.462-2.386-1.472-.882-.787-1.478-1.76-1.651-2.057-.173-.297-.018-.457.13-.605.134-.133.297-.347.445-.52.148-.174.198-.297.297-.495.099-.198.05-.372-.025-.52-.074-.148-.667-1.607-.914-2.202-.24-.579-.484-.5-.667-.51-.173-.008-.371-.01-.569-.01-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.478 0 1.462 1.065 2.874 1.213 3.072.148.198 2.096 3.2 5.078 4.488.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.75-.715 1.996-1.406.247-.69.247-1.283.173-1.406-.074-.124-.272-.198-.568-.347Z"/>
      </svg>
    </motion.a>
  )
}
