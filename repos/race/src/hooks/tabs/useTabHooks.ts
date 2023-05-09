import type { TTabAction, TTabItem, TTab } from '@gobletqa/components'

import type {
  TOnCloseFeature,
  TOnActiveFeature
} from '@GBR/types'

import { useCallback } from 'react'
import {
  useInline,
  stopEvent,
  useOnEvent,
  OnTabActiveEvent
} from '@gobletqa/components'
import {
  removeTab,
  featureToTab,
  setTabActive,
  featureFromTab,
} from '@GBR/utils/features/featureTabs'


type TUpdateTabsEvent = {
  tab:TTab
}

export type THTabHooks = {
  openedTabs:TTabItem[]
  onTabDown?:TTabAction
  onTabLeave?:TTabAction
  onTabHover?:TTabAction
  onCloseFeature: TOnCloseFeature
  onActiveFeature: TOnActiveFeature
  setOpenedTabs:(tabs:TTabItem[]) => void
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
    setOpenedTabs,
    onCloseFeature,
    onActiveFeature
  } = props

  const onTabClick = useInline<TTabAction>((tab, evt) => {
    const tabs = setTabActive(openedTabs, tab)
    setOpenedTabs(tabs)

    const feat = featureFromTab(tab)
    onActiveFeature?.(evt as Event, feat)
  })

  const onTabClose = useInline<TTabAction>((tab, evt) => {
    stopEvent(evt)

    const { tabs, active } = removeTab(openedTabs, tab)
    setOpenedTabs(tabs)
    const feat = featureFromTab(tab)
    const nextFeat = active ? featureFromTab(active?.tab) : active

    onCloseFeature?.(evt as Event, feat, nextFeat)
  })

  useOnEvent<TUpdateTabsEvent>(OnTabActiveEvent, ({ feature }, evt) => {
    const { tab } = featureToTab(feature, { active: true })
    const tabs = setTabActive(openedTabs, tab)
    setOpenedTabs(tabs)

    onActiveFeature?.(evt as Event, feature)
  })
  

  return {
    onTabClose,
    onTabClick,
    onTabDown: useTabHook(openedTabs, props.onTabDown),
    onTabHover: useTabHook(openedTabs, props.onTabHover),
    onTabLeave: useTabHook(openedTabs, props.onTabLeave),
  }
}