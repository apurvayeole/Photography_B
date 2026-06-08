import { motion } from 'framer-motion'
import { AlbumHeader } from './AlbumHeader'
import { JustifiedGrid } from './JustifiedGrid'
import { layerVariants, defaultTransition } from '../../lib/motion/variants'
import { useStackStore } from '@/store/stack'
import type {Photo } from '@/types'

interface AlbumOverlayProps {
  album: Photo
}

export function AlbumOverlay({ album }: AlbumOverlayProps) {
  const closeAlbum = useStackStore((s) => s.closeAlbum)

  return (
    /*
     * Outer wrapper: full-screen backdrop. Clicking outside the panel
     * (anywhere on this div) closes the overlay.
     */
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={defaultTransition}
      onClick={closeAlbum}
    >
      {/*
       * Content panel: ~70 vw wide, capped at 900 px, height fits content
       * up to 75 vh then scrolls internally. No flex-1 — it never stretches
       * to fill the backdrop.
       */}
      <motion.div
        className="w-[25vw] max-w-[900px] max-h-[75vh] flex flex-col overflow-hidden  bg-white dark:bg-zinc-950 shadow-2xl"
        variants={layerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <AlbumHeader album={album} />

        {/* flex-1 + min-h-0 lets this area grow within the panel cap and scroll */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          <JustifiedGrid photos={album.photos} albumId={album.id} />
        </div>
      </motion.div>
    </motion.div>
  )
}
