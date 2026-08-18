import { useMotionValue, useSpring, useTransform } from 'framer-motion'
import { usePerfTier } from './usePerfTier'

const SPRING = { stiffness: 260, damping: 20, mass: 0.4 }

/* Pointer-relative 3D tilt for cards. Returns spring-smoothed rotateX/rotateY
   (for the card itself) plus a small opposite-direction drift (for an inner
   image layer, e.g. product photos) driven by the same pointer position. */
export function useTilt3D({ max = 9, drift = 6 } = {}) {
  const { reducedMotion, coarsePointer } = usePerfTier()
  const disabled = reducedMotion || coarsePointer

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), SPRING)
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), SPRING)
  const driftX = useSpring(useTransform(px, [0, 1], [drift, -drift]), SPRING)
  const driftY = useSpring(useTransform(py, [0, 1], [drift, -drift]), SPRING)

  const handlers = disabled ? {} : {
    onMouseMove: (e) => {
      const rect = e.currentTarget.getBoundingClientRect()
      px.set((e.clientX - rect.left) / rect.width)
      py.set((e.clientY - rect.top) / rect.height)
    },
    onMouseLeave: () => { px.set(0.5); py.set(0.5) },
  }

  return { rotateX, rotateY, driftX, driftY, handlers }
}
