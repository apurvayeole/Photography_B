export interface JustifiedPhoto {
  id: string
  width: number
  height: number
}

export interface JustifiedItem extends JustifiedPhoto {
  top: number
  left: number
  displayWidth: number
  displayHeight: number
}

export interface JustifiedRow {
  items: JustifiedItem[]
  top: number
  height: number
}

export interface JustifiedLayoutOptions {
  containerWidth: number
  targetRowHeight: number
  spacing: number
}

export function computeJustifiedLayout(
  _photos: JustifiedPhoto[],
  _options: JustifiedLayoutOptions,
): JustifiedRow[] {
  return []
}
