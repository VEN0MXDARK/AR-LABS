import { useEffect, useState } from 'react'

function computeTier() {
  if (typeof window === 'undefined') {
    return { reducedMotion: false, coarsePointer: false, isMobile: false, tier: 'high' }
  }
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  const isMobile = window.innerWidth <= 820
  const lowCores = (navigator.hardwareConcurrency || 8) <= 4
  const tier = reducedMotion || coarsePointer || isMobile || lowCores ? 'low' : 'high'
  return { reducedMotion, coarsePointer, isMobile, tier }
}

/* Shared reduced-motion / mobile / device-tier detection, driving every
   motion effect on the site so they degrade together instead of piecemeal. */
export function usePerfTier() {
  const [state, setState] = useState(computeTier)

  useEffect(() => {
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mqPointer = window.matchMedia('(pointer: coarse)')
    const update = () => setState(computeTier())
    mqReduced.addEventListener('change', update)
    mqPointer.addEventListener('change', update)
    window.addEventListener('resize', update)
    return () => {
      mqReduced.removeEventListener('change', update)
      mqPointer.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return state
}
