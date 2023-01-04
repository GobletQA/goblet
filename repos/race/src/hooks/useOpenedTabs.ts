import type { TTabAction, TTabItem } from '@gobletqa/components'
import type {
  TFeaturesRef,
  TRaceFeature,
  TOnFeatureCB,
} from '@GBR/types'

import { useFeature } from '@GBR/contexts'
import { useTabHooks } from './useTabHooks'
import { useMemo, useState, useCallback } from 'react'
import { EmptyFeatureUUID } from '@GBR/constants/values'
import { useInline, stopEvent } from '@gobletqa/components'
import {
  removeTab,
  setTabActive,
  featureToTab,
  featureFromTab,
} from '@GBR/utils/features/featureTabs'


export type THOpenedTabs = {
  onTabDown?:TTabAction
  onTabLeave?:TTabAction
  onTabHover?:TTabAction
  featuresRef:TFeaturesRef
  onFeatureClose:TOnFeatureCB
  onFeatureActive:TOnFeatureCB
}

export const useOpenedTabs = (props:THOpenedTabs) => {

  const {
    onTabDown,
    onTabLeave,
    onTabHover,
    featuresRef,
    onFeatureClose,
    onFeatureActive,
  } = props

  const { feature, setFeature } = useFeature()

  const initialTabs = useMemo(() => {
    return feature?.uuid ? [featureToTab(feature, { active: true })] : []
  }, [])

  const [openedTabs, setOpenedTabs] = useState<TTabItem[]>(initialTabs)

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

  // There should only be one tab with an empty uuid
  // always filter out any existing tags with that uuid
  // The first call here, adds the tab with an empty uuid
  // The second call removes it and replaces it
  // With the updated feature that should now have a valid uuid
  const updateEmptyTab = useInline((updated:TRaceFeature) => {
    const cleaned = openedTabs.filter(tab => tab.tab.uuid !== EmptyFeatureUUID)
    const updatedTabs = setTabActive(cleaned, updated)

    setOpenedTabs(updatedTabs)
  })

  const tabHooks = useTabHooks({
    openedTabs,
    onTabDown,
    onTabLeave,
    onTabHover,
  })

  return {
    ...tabHooks,
    openedTabs,
    setOpenedTabs,
    onCloseFeature,
    updateEmptyTab,
    onActiveFeature,
  }
}