import type { TTabStyles, TTab } from '../goblet'

type KeyOfTab = keyof TTab
export const TabRefs:KeyOfTab[] = [`uuid`, `id`, `key`] 

export const TabStyles:TTabStyles = {
  icon: {
    fontSize: `16px`,
  }
}
