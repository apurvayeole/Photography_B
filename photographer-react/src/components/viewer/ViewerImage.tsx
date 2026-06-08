

import { motion } from 'framer-motion'

import { useStackStore } from '@/store/stack'
import type { Album } from '@/types'

interface ViewerImageProps {
  album: Album
}

export function ViewerImage({ album }: ViewerImageProps) {
  const activePhotoId = useStackStore((s) => s.activePhotoId)
  const photo = album.photos.find((p) => p.id === activePhotoId) ?? null

  if (!photo) return null

  return (
    /*
     * key forces React to remount on navigation so Framer Motion sees a new
     * element and triggers a fresh FLIP from the matching GridImage layoutId.
     * max-w/max-h with generous viewport margins — portrait fills height,
     * landscape fills width, aspect ratio always preserved.
     */
    <motion.div
      key={photo.id}
      layoutId={`photo-${photo.id}`}
      className="overflow-hidden"
    >
      <img
        src={photo.url}
        alt={photo.caption ?? ''}
        width={photo.width}
        height={photo.height}
        className="block max-w-screen max-h-screen"
    
      />
    </motion.div>
  )
}
