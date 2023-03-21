import type { TTabAction, TTabItem } from '@gobletqa/components'
import type {
  TFeaturesRef,
  TOnFeatureCB,
} from '@GBR/types'

import { useCallback } from 'react'
import { useEditor } from '@GBR/contexts'
import { useTabHooks } from './useTabHooks'
import { stopEvent } from '@gobletqa/components'
import {
  removeTab,
  setTabActive,
  featureFromTab,
} from '@GBR/utils/features/featureTabs'

export type THOpenedTabs = {
  openedTabs:TTabItem[]
  onTabDown?:TTabAction
  onTabLeave?:TTabAction
  onTabHover?:TTabAction
  featuresRef:TFeaturesRef
  onFeatureClose?:TOnFeatureCB
  onFeatureActive?:TOnFeatureCB
  setOpenedTabs:(tabs:TTabItem[]) => void
}

export const useTabCallbacks = (props:THOpenedTabs) => {

  const {
    openedTabs,
    onTabDown,
    onTabLeave,
    onTabHover,
    featuresRef,
    setOpenedTabs,
    onFeatureClose,
    onFeatureActive,
  } = props

  const { feature, setFeature } = useEditor()

  const onActiveFeature = useCallback<TTabAction>((tab, ...rest) => {
    if(tab.uuid === feature?.uuid) return

    const feat = featureFromTab(tab, featuresRef.current)

    const updatedTabs = setTabActive(openedTabs, tab)
    onFeatureActive?.(feat, ...rest)

    setOpenedTabs(updatedTabs)
    setFeature(feat)

  }, [feature, openedTabs])

  const onCloseFeature = useCallback<TTabAction>((tab, evt, ...rest) => {
    stopEvent(evt)

    const feat = featureFromTab(tab, featuresRef.current)
    onFeatureClose?.(feat, ...rest)

    const { tabs: updated, active } = removeTab(openedTabs, tab)
    setOpenedTabs(updated)
    const nextFeat = active ? featureFromTab(active?.tab, featuresRef.current) : active

    setFeature(nextFeat)
  }, [feature, openedTabs])


  const tabHooks = useTabHooks({
    openedTabs,
    onTabDown,
    onTabLeave,
    onTabHover,
  })

  return {
    ...tabHooks,
    onCloseFeature,
    onActiveFeature,
  }
}