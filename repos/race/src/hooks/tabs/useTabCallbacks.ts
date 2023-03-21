import type { TTabAction, TTabItem } from '@gobletqa/components'
import type {
  TFeaturesRef,
  TOnFeatureCB,
} from '@GBR/types'

import { useCallback, useEffect } from 'react'
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
  onFeatureInactive?:TOnFeatureCB
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

  /**
   * On feature inactive called in the setFeature method when the feature uuid changes
   */
  const onActiveFeature = useCallback<TTabAction>((tab, ...rest) => {
    if(tab.uuid === feature?.uuid)
      return console.log(`Can not set feature active. It is already active`)

    const feat = featureFromTab(tab, featuresRef.current)
    const updatedTabs = setTabActive(openedTabs, tab)

    setOpenedTabs(updatedTabs)
    setFeature(feat)

    feat && onFeatureActive?.(feat, ...rest)

  }, [feature, openedTabs])

  const onCloseFeature = useCallback<TTabAction>((tab, evt, ...rest) => {
    stopEvent(evt)

    const feat = featureFromTab(tab, featuresRef.current)
    onFeatureClose?.(feat, ...rest)

    const { tabs: updated, active } = removeTab(openedTabs, tab)
    setOpenedTabs(updated)
    const nextFeat = active ? featureFromTab(active?.tab, featuresRef.current) : active

    setFeature(nextFeat)

    nextFeat && onFeatureActive?.(nextFeat)

  }, [feature, openedTabs, setFeature])


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