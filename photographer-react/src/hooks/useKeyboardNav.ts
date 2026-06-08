

import { useEffect } from 'react'
import { useStackStore } from '@/store/stack'

export function useKeyboardNav() {
  const nextPhoto = useStackStore((s) => s.nextPhoto)
  const prevPhoto = useStackStore((s) => s.prevPhoto)
  const closePhoto = useStackStore((s) => s.closePhoto)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') nextPhoto()
      else if (e.key === 'ArrowLeft') prevPhoto()
      else if (e.key === 'Escape') closePhoto()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextPhoto, prevPhoto, closePhoto])
}
