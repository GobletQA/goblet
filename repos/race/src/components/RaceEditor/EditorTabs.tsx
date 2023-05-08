import type { ComponentProps } from 'react'
import type { TTabAction, TTabItem } from '@gobletqa/components'
import type {
  TFeaturesRef,
  TOnCloseFeature,
  TOnActiveFeature
} from '@GBR/types'

import {
  removeTab,
  setTabActive,
  featureFromTab,
} from '@GBR/utils/features/featureTabs'

import {
  stopEvent,
  useInline,
  OpenedTabs,
} from '@gobletqa/components'

export type TEditorTabs = Omit<ComponentProps<typeof OpenedTabs>, `onTabClose`|`onTabClick`> & {
  openedTabs:TTabItem[]
  featuresRef:TFeaturesRef
  onTabClose?:TOnCloseFeature
  onTabClick?:TOnActiveFeature
  setOpenedTabs:(tabs:TTabItem[]) => void
}

export const EditorTabs = (props:TEditorTabs) => {
  
  const {
    openedTabs,
    onTabClick,
    onTabClose,
    featuresRef,
    setOpenedTabs
  } = props
  
  const onClick = useInline<TTabAction>((tab, evt) => {
    const feat = featureFromTab(tab)
    const tabs = setTabActive(openedTabs, tab)
    setOpenedTabs(tabs)
    onTabClick?.(evt as Event, feat)
  })

  const onClose = useInline<TTabAction>((tab, evt) => {
    stopEvent(evt)

    const { tabs, active } = removeTab(openedTabs, tab)
    setOpenedTabs(tabs)
    const feat = featureFromTab(tab)
    const nextFeat = active ? featureFromTab(active?.tab) : active

    onTabClose?.(evt as Event, feat, nextFeat)
  })

  return (
    <OpenedTabs
      {...props}
      onTabClose={onClose}
      onTabClick={onClick}
    />
  )
}