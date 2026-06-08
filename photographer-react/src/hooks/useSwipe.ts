
import type { RefObject } from 'react'

export interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeDown?: () => void
}

export function useSwipe(
  _ref: RefObject<HTMLElement | null>,
  _handlers: SwipeHandlers,
) {}
