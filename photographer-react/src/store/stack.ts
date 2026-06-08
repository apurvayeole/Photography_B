import { create } from 'zustand'

export type Layer = 'profile' | 'album' | 'viewer'

interface StackState {
  activeAlbumId: string | null
  activePhotoId: string | null
  albumPhotoIds: string[]
  controlsVisible: boolean
}

interface StackActions {
  openAlbum: (id: string) => void
  closeAlbum: () => void
  openPhoto: (id: string) => void
  closePhoto: () => void
  setAlbumPhotos: (ids: string[]) => void
  nextPhoto: () => void
  prevPhoto: () => void
  setControlsVisible: (visible: boolean) => void
}

type StackStore = StackState & StackActions

export const useStackStore = create<StackStore>((set) => ({
  activeAlbumId: null,
  activePhotoId: null,
  albumPhotoIds: [],
  controlsVisible: true,

  openAlbum: (id) => set({ activeAlbumId: id, activePhotoId: null }),
  closeAlbum: () => set({ activeAlbumId: null, activePhotoId: null }),

  openPhoto: (id) => set({ activePhotoId: id }),
  closePhoto: () => set({ activePhotoId: null }),

  setAlbumPhotos: (ids) => set({ albumPhotoIds: ids }),

  nextPhoto: () =>
    set((state) => {
      const { albumPhotoIds, activePhotoId } = state
      if (!albumPhotoIds.length) return state
      const idx = albumPhotoIds.indexOf(activePhotoId ?? '')
      return { activePhotoId: albumPhotoIds[(idx + 1) % albumPhotoIds.length] }
    }),

  prevPhoto: () =>
    set((state) => {
      const { albumPhotoIds, activePhotoId } = state
      if (!albumPhotoIds.length) return state
      const idx = albumPhotoIds.indexOf(activePhotoId ?? '')
      const len = albumPhotoIds.length
      return { activePhotoId: albumPhotoIds[(idx - 1 + len) % len] }
    }),

  setControlsVisible: (visible) => set({ controlsVisible: visible }),
}))

export function selectLayer(state: StackState): Layer {
  if (state.activePhotoId) return 'viewer'
  if (state.activeAlbumId) return 'album'
  return 'profile'
}
