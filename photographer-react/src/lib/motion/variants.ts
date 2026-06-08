import type { Variants, Transition } from 'framer-motion'

export const EASING = [0.22, 1, 0.36, 1] as const

export const defaultTransition: Transition = {
  ease: EASING,
  duration: 0.35,
}

export const layerVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { ...defaultTransition, duration: 0.5 } },
  exit: { opacity: 0, y: 20, scale: 0.97, transition: defaultTransition },
}

export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: defaultTransition },
  exit: { opacity: 0, transition: defaultTransition },
}

export const controlsVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

export const slideVariants = {
  enterFromRight: { x: '100%', opacity: 0 },
  enterFromLeft: { x: '-100%', opacity: 0 },
  center: { x: 0, opacity: 1, transition: defaultTransition },
  exitToLeft: { x: '-100%', opacity: 0, transition: defaultTransition },
  exitToRight: { x: '100%', opacity: 0, transition: defaultTransition },
}
