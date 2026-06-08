export function requestFullscreen(element: HTMLElement): Promise<void> {
  if (element.requestFullscreen) return element.requestFullscreen()
  return Promise.resolve()
}

export function exitFullscreen(): Promise<void> {
  if (typeof document !== 'undefined' && document.exitFullscreen) {
    return document.exitFullscreen()
  }
  return Promise.resolve()
}

export function isFullscreenAvailable(): boolean {
  return typeof document !== 'undefined' && 'fullscreenEnabled' in document
}

export function isFullscreenActive(): boolean {
  return typeof document !== 'undefined' && !!document.fullscreenElement
}
