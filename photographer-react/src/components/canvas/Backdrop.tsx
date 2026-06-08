import { motion } from 'framer-motion'
import { backdropVariants } from '@/lib/motion/variants'

export function Backdrop() {
  return (
    <motion.div
      className="absolute inset-0 bg-black/60 z-10"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    />
  )
}
