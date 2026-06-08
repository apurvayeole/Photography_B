

import { useStackStore } from '@/store/stack'
import type { Album } from '@/types'

interface AlbumHeaderProps {
  album: Album
}

export function AlbumHeader({ album }: AlbumHeaderProps) {
  const closeAlbum = useStackStore((s) => s.closeAlbum)

  // return (
  //   <header className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
  //     <button
  //       onClick={closeAlbum}
  //       className="flex items-center justify-center w-9 h-9 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
  //       aria-label="Back to profile"
  //     >
  //       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //         <path d="M15 18l-6-6 6-6" />
  //       </svg>
  //     </button>

  //     <div className="flex-1 min-w-0">
  //       <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 leading-tight truncate">
  //         {album.title}
  //       </h2>
  //       {album.caption && (
  //         <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
  //           {album.caption}
  //         </p>
  //       )}
  //     </div>
  //   </header>
  // )
}
