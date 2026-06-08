
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ViewerImage } from './ViewerImage'
import { ViewerControls } from './ViewerControls'
import { defaultTransition } from '../../lib/motion/variants'
import { useAutoHideControls } from '@/hooks/useAutoHideControls'
import { useKeyboardNav } from '@/hooks/useKeyboardNav'
import { useFullscreen } from '@/hooks/useFullscreen'
import { useStackStore } from '@/store/stack'
import type { Album } from '@/types'

interface FullscreenViewerProps {
  album: Album
}

export function FullscreenViewer({ album }: FullscreenViewerProps) {
  const setAlbumPhotos = useStackStore((s) => s.setAlbumPhotos)
  const containerRef = useRef<HTMLDivElement>(null)

  // Register all photo ids so prev/next can navigate
  useEffect(() => {
    setAlbumPhotos(album.photos.map((p) => p.id))
  }, [album, setAlbumPhotos])

  const { onActivity } = useAutoHideControls(2500)
  useKeyboardNav()
  const { enter } = useFullscreen(containerRef)

  // Attempt browser fullscreen when viewer opens
  useEffect(() => {
    enter()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    /*
     * Container only fades — no y/scale so it doesn't fight the FLIP
     * transition happening inside ViewerImage.
     */
    <motion.div
      ref={containerRef}
      className="absolute inset-0 z-30 bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={defaultTransition}
      onClick={onActivity}
      onTouchStart={onActivity}
    >
      <ViewerImage album={album} />
      <ViewerControls album={album} />
    </motion.div>
  )
}
