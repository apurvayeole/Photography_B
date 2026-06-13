import { motion } from 'framer-motion'
import { useStackStore } from '@/store/stack'
import type { Album } from '@/types'

interface AlbumCoverProps {
  album: Album
}

export function AlbumCover({ album }: AlbumCoverProps) {
  const openAlbum = useStackStore((s) => s.openAlbum)

  return (
    <button
      className="w-full text-left group cursor-pointer"
      onClick={() => openAlbum(album.id)}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
        <motion.img
          src={album.coverUrl}
          alt={album.title}
          className="absolute inset-0 w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      {/* <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 truncate px-0.5">
        {album.title}
      </p> */}
    </button>
  )
}
