import type { TTabAction, TTabItem } from '@gobletqa/components'

import { useCallback } from 'react'
import { useInline } from '@gobletqa/components'

export type THTabHooks = {
  openedTabs:TTabItem[]
  onTabDown?:TTabAction
  onTabLeave?:TTabAction
  onTabHover?:TTabAction
}

const useTabHook = (openedTabs:TTabItem[], cb?:TTabAction) => {
  const callback = useInline(cb)
  return useCallback<TTabAction>((tab, ...rest) => {
    callback?.(tab, ...rest)
  }, [openedTabs])
}

export const useTabHooks = (props:THTabHooks) => {
  const {
    openedTabs,
  } = props

  return {
    onTabDown: useTabHook(openedTabs, props.onTabDown),
    onTabHover: useTabHook(openedTabs, props.onTabHover),
    onTabLeave: useTabHook(openedTabs, props.onTabLeave),
  }
}