import { AlbumCover } from './AlbumCover'
import type { Album } from '@/types'

interface AlbumGridProps {
  albums: Album[]
}

export function AlbumGrid({ albums }: AlbumGridProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 pb-16">
      <div className="grid grid-cols-6 gap-1">
        {albums.map((album) => (
          <AlbumCover key={album.id} album={album} />
        ))}
        {albums.map((album) => (
          <AlbumCover key={`${album.id}-2`} album={album} />
        ))}
      </div>
    </div>
  )
}
