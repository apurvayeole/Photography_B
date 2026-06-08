
import { useState, useEffect, useCallback, type RefObject } from 'react'

export function useFullscreen(targetRef?: RefObject<HTMLElement | null>) {
  const isAvailable = typeof document !== 'undefined' && 'requestFullscreen' in document.documentElement

  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    function onChange() {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const enter = useCallback(async () => {
    try {
      const el = targetRef?.current ?? document.documentElement
      await el.requestFullscreen()
    } catch {
      // Browser blocked fullscreen (e.g. no user gesture, iframe sandbox). Fall
      // back silently — the absolute inset-0 overlay already looks fullscreen.
    }
  }, [targetRef])

  const exit = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
    } catch {
      // ignore
    }
  }, [])

  const toggle = useCallback(() => {
    isFullscreen ? exit() : enter()
  }, [isFullscreen, enter, exit])

  return { isFullscreen, isAvailable, enter, exit, toggle }
}
