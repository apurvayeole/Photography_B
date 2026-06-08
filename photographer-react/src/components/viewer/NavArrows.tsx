
import { useStackStore } from '@/store/stack'

export function NavArrows() {
  const nextPhoto = useStackStore((s) => s.nextPhoto)
  const prevPhoto = useStackStore((s) => s.prevPhoto)

  return (
    <>
      <button
        onClick={prevPhoto}
        className="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-colors"
        aria-label="Previous photo"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M13 15L8 10L13 5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        onClick={nextPhoto}
        className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-colors"
        aria-label="Next photo"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M7 5L12 10L7 15" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  )
}
