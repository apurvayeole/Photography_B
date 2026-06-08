

import { useStackStore, selectLayer } from '@/store/stack'

export function useLayerStack() {
  const store = useStackStore()
  const layer = useStackStore(selectLayer)

  return { ...store, layer }
}
