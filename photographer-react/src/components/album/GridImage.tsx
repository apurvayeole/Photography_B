import { motion } from 'framer-motion'
import { useStackStore } from '@/store/stack'
import type { Photo } from '@/types'
interface GridImageProps {
  photo: Photo
  albumId: string
  index: number
}

export function GridImage({ photo, index }: GridImageProps) {
  const openPhoto = useStackStore((s) => s.openPhoto)

  return (
    /*
     * Outer div keeps the masonry column-break behaviour.
     * The motion.div is the FLIP anchor — its layoutId must match the one
     * in ViewerImage so Framer Motion can animate between the two positions.
     */
    <div className="break-inside-avoid mb-1">
      <motion.div
        layoutId={`photo-${photo.id}`}
        className="overflow-hidden cursor-pointer"
        onClick={() => openPhoto(photo.id)}
      >
        <img
  src={photo.url}
  alt={photo.caption ?? `Photo ${index + 1}`}
  className="w-full h-auto block"
/>
      </motion.div>
    </div>
  )
}
