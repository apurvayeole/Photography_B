import { motion, AnimatePresence } from 'framer-motion'
import { ProfileScene } from '@/components/profile/ProfileScene'
import { Backdrop } from '@/components/canvas/Backdrop'
import { AlbumOverlay } from '@/components/album/AlbumOverlay'
import { FullscreenViewer } from '@/components/viewer/FullscreenViewer'
import { useStackStore, selectLayer } from '@/store/stack'
import { EASING } from '@/lib/motion/variants'
import type { Profile } from '@/types'

interface CanvasProps {
  profile: Profile
  initialAlbumId?: string | null
  initialPhotoId?: string | null
}

export function Canvas({ profile }: CanvasProps) {
  const layer = useStackStore(selectLayer)
  const activeAlbumId = useStackStore((s) => s.activeAlbumId)
  const activeAlbum = profile.albums.find((a) => a.id === activeAlbumId) ?? null

  const isDimmed = layer !== 'profile'

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* LAYER 0 — scales back and blurs when any overlay is active */}
      <motion.div
        className="absolute inset-0"
        animate={
          isDimmed
            ? { scale: 0.96, filter: 'blur(7px)' }
            : { scale: 1,    filter: 'blur(0px)'  }
        }
        transition={{ ease: EASING, duration: 0.5 }}
      >
        <ProfileScene profile={profile} />
      </motion.div>

      {/* Dark overlay — between layer 0 and layer 1 */}
      <AnimatePresence>
        {isDimmed && <Backdrop key="backdrop" />}
      </AnimatePresence>

      {/* LAYER 1 — album overlay */}
      <AnimatePresence>
        {isDimmed && activeAlbum && (
          <AlbumOverlay key="album-overlay" album={activeAlbum} albums={profile.albums} />
        )}
      </AnimatePresence>

      {/* LAYER 2 — fullscreen viewer */}
      <AnimatePresence>
        {layer === 'viewer' && activeAlbum && (
          <FullscreenViewer key="fullscreen-viewer" album={activeAlbum} />
        )}
      </AnimatePresence>

    </div>
  )
}
