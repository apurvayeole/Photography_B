

export interface VirtualRow {
  index: number
  top: number
  height: number
}

export function useVirtualizedGrid(
  _rowCount: number,
  _rowHeights: number[],
  _containerHeight: number,
  _scrollTop: number,
  _overscan = 3,
): VirtualRow[] {
  return []
}
