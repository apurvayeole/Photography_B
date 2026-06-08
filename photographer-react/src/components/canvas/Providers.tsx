import { MotionConfig } from 'framer-motion'
import { EASING } from '@/lib/motion/variants'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: EASING, duration: 0.35 }}>
      {children}
    </MotionConfig>
  )
}
