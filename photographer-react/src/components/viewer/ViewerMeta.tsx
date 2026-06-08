

import type { Photo, Album } from '@/types'

interface ViewerMetaProps {
  photo: Photo
  album: Album
}

export function ViewerMeta({ photo, album }: ViewerMetaProps) {
  return (
    <>
      {/* Gradient underlay so text is readable over any image */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

      {/* Bottom-left: per-photo metadata */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-0.5 pointer-events-none">
        {photo.camera && (
          <span className="text-white/90 text-sm font-medium leading-tight">{photo.camera}</span>
        )}
        {photo.lens && (
          <span className="text-white/60 text-xs leading-tight">{photo.lens}</span>
        )}
        {photo.captureDate && (
          <span className="text-white/60 text-xs leading-tight">{photo.captureDate}</span>
        )}
        {photo.location && (
          <span className="text-white/60 text-xs leading-tight">{photo.location}</span>
        )}
      </div>

      {/* Bottom-right: album caption */}
      {album.caption && (
        <div className="absolute bottom-6 right-6 pointer-events-none">
          <span className="text-white/50 text-xs italic">{album.caption}</span>
        </div>
      )}
    </>
  )
}
