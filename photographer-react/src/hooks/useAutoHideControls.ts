

import { useEffect, useRef, useCallback } from 'react'
import { useStackStore } from '@/store/stack'

export function useAutoHideControls(delayMs = 2500) {
  const setControlsVisible = useStackStore((s) => s.setControlsVisible)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetTimer = useCallback(() => {
    setControlsVisible(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setControlsVisible(false), delayMs)
  }, [setControlsVisible, delayMs])

  useEffect(() => {
    resetTimer()
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      // Restore visibility so controls don't stay hidden if viewer reopens
      setControlsVisible(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { onActivity: resetTimer }
}
