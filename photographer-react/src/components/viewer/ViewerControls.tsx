

import { motion } from 'framer-motion'
import { CloseButton } from './CloseButton'
import { NavArrows } from './NavArrows'
import { ViewerMeta } from './ViewerMeta'
import { useStackStore } from '@/store/stack'
import type { Album } from '@/types'

interface ViewerControlsProps {
  album: Album
}

export function ViewerControls({ album }: ViewerControlsProps) {
  const controlsVisible = useStackStore((s) => s.controlsVisible)
  const activePhotoId = useStackStore((s) => s.activePhotoId)
  const photo = album.photos.find((p) => p.id === activePhotoId) ?? null

  return (
    // Always mounted; opacity fades so controls never flash in/out abruptly
    <motion.div
      className="absolute inset-0 pointer-events-none"
      animate={{ opacity: controlsVisible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <CloseButton />
      <NavArrows />
      {photo && <ViewerMeta photo={photo} album={album} />}
    </motion.div>
  )
}
