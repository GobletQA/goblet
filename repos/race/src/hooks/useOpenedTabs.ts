import type { TTabAction, TTabItem } from '@gobletqa/components'
import type {
  TRaceFeature,
  TOnFeatureCB,
  TEditorContainer,
} from '@GBR/types'


import { useFeature } from '@GBR/contexts'
import { useMemo, useState, useCallback } from 'react'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { EmptyFeatureUUID } from '@GBR/constants/values'
import { UpdateEmptyFeatureTabEvt } from '@GBR/constants/events'
import { useInline, useEffectOnce, stopEvent } from '@gobletqa/components'

import {
  removeTab,
  setTabActive,
  featureToTab,
  featureFromTab,
} from '@GBR/utils/features/featureTabs'

export type THOpenedTabs = {
  onFeatureClose:TOnFeatureCB
  onFeatureActive:TOnFeatureCB
}

export const useOpenedTabs = (props:TEditorContainer, ext:THOpenedTabs) => {

  const {
    featuresRef,
    onTabDown:onTabDownCB,
    onTabLeave:onTabLeaveCB,
    onTabHover:onTabHoverCB,
  } = props

  const {
    onFeatureClose,
    onFeatureActive,
  } = ext

  const { feature, setFeature } = useFeature()

  const initialTabs = useMemo(() => {
    return feature?.uuid ? [featureToTab(feature, { active: true })] : []
  }, [])

  const [openedTabs, setOpenedTabs] = useState<TTabItem[]>(initialTabs)

  const onActiveFeature = useCallback<TTabAction>((tab, ...rest) => {
    if(tab.uuid === feature.uuid) return

    const feat = featureFromTab(tab, featuresRef.current)

    const updatedTabs = setTabActive(openedTabs, tab)
    onFeatureActive?.(feat, ...rest)

    setOpenedTabs(updatedTabs)
    setFeature(feat)

  }, [feature, openedTabs, setFeature])

  const onCloseFeature = useCallback<TTabAction>((tab, evt, ...rest) => {
    stopEvent(evt)

    const feat = featureFromTab(tab, featuresRef.current)
    onFeatureClose?.(feat, ...rest)

    const { tabs: updated, active } = removeTab(openedTabs, tab)
    setOpenedTabs(updated)
    const nextFeat = active ? featureFromTab(active?.tab, featuresRef.current) : active

    setFeature(nextFeat)
  }, [feature, openedTabs, setFeature])

  const onTabHover = useCallback<TTabAction>((tab, ...rest) => {
    onTabHoverCB?.(tab, ...rest)
  }, [openedTabs])

  const onTabLeave = useCallback<TTabAction>((tab, ...rest) => {
    onTabLeaveCB?.(tab, ...rest)
  }, [openedTabs])

  const onTabDown = useCallback<TTabAction>((tab, ...rest) => {
    onTabDownCB?.(tab, ...rest)
  }, [openedTabs])

  const updateEmptyTab = useInline((updated:TRaceFeature) => {
    // There should only be one tab with an empty uuid
    // always filter out any existing tags with that uuid
    // The first call here, adds the tab with an empty uuid
    // The second call removes it and replaces it
    // With the updated feature that should now have a valid uuid
    const cleaned = openedTabs.filter(tab => tab.tab.uuid !== EmptyFeatureUUID)
    const updatedTabs = setTabActive(cleaned, updated)

    setOpenedTabs(updatedTabs)
  })

  useEffectOnce(() => {
    const updateOff = EE.on<TRaceFeature>(
      UpdateEmptyFeatureTabEvt,
      updateEmptyTab
    )

    return () => {
      updateOff?.()
    }
  })


  return {
    openedTabs,
    onTabDown,
    onTabHover,
    onTabLeave,
    setOpenedTabs,
    onCloseFeature,
    onActiveFeature,
  }
}