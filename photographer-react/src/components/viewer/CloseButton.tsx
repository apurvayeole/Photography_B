

import { useStackStore } from '@/store/stack'

export function CloseButton() {
  const closePhoto = useStackStore((s) => s.closePhoto)

  return (
     <button
  onClick={closePhoto}
  className="
    pointer-events-auto
    absolute
    top-4
    right-4
    z-50
    flex
    items-center
    justify-center
    w-10
    h-10
    rounded-full
    bg-white/10
    text-white
    hover:bg-white/20
    transition-colors
  "
>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" > <path d="M18 6L6 18M6 6l12 12" /> </svg>
</button>
  )
}
