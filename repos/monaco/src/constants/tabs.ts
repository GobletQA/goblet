import type { TTabStyles, TTab } from '@gobletqa/components'

type KeyOfTab = keyof TTab
export const TabRefs:KeyOfTab[] = [`uuid`, `path`] 

export const TabStyles:TTabStyles = {
  icon: {
    fontSize: `16px`,
  }
}
