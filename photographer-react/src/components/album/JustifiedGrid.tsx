

import { GridImage } from './GridImage'
import type { Photo } from '@/types'

interface JustifiedGridProps {
  photos: Photo[]
  albumId: string
}

export function JustifiedGrid({ photos, albumId }: JustifiedGridProps) {
  return (
    /*
     * CSS columns masonry. Each image preserves its natural aspect ratio
     * (width: 100%, height: auto). The justified layout algorithm
     * (lib/layout/justified.ts) replaces this in a later pass.
     */
    <div className="columns-2 sm:columns-5 gap-0.5 p-1">
      {photos.map((photo, index) => (
        <GridImage
          key={photo.id}
          photo={photo}
          albumId={albumId}
          index={index}
        />
      ))}
    </div>
  )
}
