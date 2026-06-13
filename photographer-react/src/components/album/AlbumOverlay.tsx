import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { defaultTransition } from '../../lib/motion/variants'
import { useStackStore } from '@/store/stack'
import type { Album } from '@/types'

interface AlbumOverlayProps {
  album: Album
  albums: Album[]
}

export function AlbumOverlay({ album, albums }: AlbumOverlayProps) {
  const closeAlbum = useStackStore((s) => s.closeAlbum)
  const openAlbum = useStackStore((s) => s.openAlbum)
  const openPhoto = useStackStore((s) => s.openPhoto)
  const setAlbumPhotos = useStackStore((s) => s.setAlbumPhotos)

  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const photos = album.photos
  const photo = photos[index]

  const albumIndex = albums.findIndex((a) => a.id === album.id)

  const go = useCallback(
    (dir: number) => {
      setDirection(dir)
      setIndex((i) => (i + dir + photos.length) % photos.length)
    },
    [photos.length],
  )

  const goAlbum = (dir: number) => {
    const next = (albumIndex + dir + albums.length) % albums.length
    openAlbum(albums[next].id)
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'Escape') closeAlbum()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [go, closeAlbum])

  useEffect(() => {
    setIndex(0)
    setDirection(0)
  }, [album.id])

  const handleImageClick = () => {
    setAlbumPhotos(photos.map((p) => p.id))
    openPhoto(photo.id)
  }

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={defaultTransition}
      onClick={closeAlbum}
    >
      {/* Modal container */}
      <motion.div
        className="relative flex w-[82vw] max-w-[1100px] h-[78vh] rounded-xl overflow-hidden bg-zinc-950 shadow-2xl"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={defaultTransition}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Album prev arrow — outside left edge of modal */}
        {albums.length > 1 && (
          <button
            onClick={() => goAlbum(-1)}
            className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
            aria-label="Previous album"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* Album next arrow — outside right edge of modal */}
        {albums.length > 1 && (
          <button
            onClick={() => goAlbum(1)}
            className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
            aria-label="Next album"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}

        {/* ── Left: image carousel ── */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-black">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img
              key={photo.id}
              src={photo.url}
              alt={photo.caption ?? `Photo ${index + 1}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              className="max-h-full max-w-full object-contain select-none cursor-zoom-in"
              draggable={false}
              onClick={handleImageClick}
            />
          </AnimatePresence>

          {/* Prev photo arrow */}
          {photos.length > 1 && (
            <button
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
              aria-label="Previous photo"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          {/* Next photo arrow */}
          {photos.length > 1 && (
            <button
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
              aria-label="Next photo"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}

          {/* Dot indicators */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i) }}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === index ? 'bg-white' : 'bg-white/35 hover:bg-white/60'
                  }`}
                  aria-label={`Go to photo ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Right: info panel ── */}
        <div className="w-[280px] shrink-0 flex flex-col border-l border-zinc-800">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 shrink-0">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-white leading-tight truncate">
                {album.title}
              </h2>
              {album.caption && (
                <p className="text-[11px] text-zinc-400 mt-0.5 truncate">{album.caption}</p>
              )}
            </div>
            <button
              onClick={closeAlbum}
              className="ml-3 shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close album"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Counter */}
          <div className="px-4 pt-3 pb-1 shrink-0">
            <span className="text-[10px] text-zinc-500 font-mono">{index + 1} / {photos.length}</span>
          </div>

          {/* Info */}
          <div className="flex-1 overflow-y-auto px-4 pb-5 space-y-4">
            {photo.caption && (
              <p className="text-xs text-zinc-200 leading-relaxed">{photo.caption}</p>
            )}

            <div className="space-y-3">
              {photo.camera && <InfoRow icon={<CameraIcon />} label="Camera" value={photo.camera} />}
              {photo.lens && <InfoRow icon={<LensIcon />} label="Lens" value={photo.lens} />}
              {photo.captureDate && <InfoRow icon={<CalendarIcon />} label="Date" value={photo.captureDate} />}
              {photo.location && <InfoRow icon={<PinIcon />} label="Location" value={photo.location} />}
            </div>

            {/* Album list */}
            {albums.length > 1 && (
              <div className="pt-2 border-t border-zinc-800">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Albums</p>
                <div className="space-y-1">
                  {albums.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => openAlbum(a.id)}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                        a.id === album.id
                          ? 'bg-zinc-700 text-white'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                      }`}
                    >
                      {a.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-zinc-500 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-0.5">{label}</p>
        <p className="text-[11px] text-zinc-200 leading-snug">{value}</p>
      </div>
    </div>
  )
}

function CameraIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}
function LensIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" />
    </svg>
  )
}
function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}
function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  )
}
