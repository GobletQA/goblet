import type { TTabAction, TTabItem } from '../goblet'
import type {
  TOnFeatureCBRef,
  TEditorContainer,
} from '../types'

import { stopEvent } from '../goblet'
import { useFeature } from '../contexts'
import { setTabActive } from '../utils/featureTabs'
import { useMemo, useState, useCallback } from 'react'
import {
  removeTab,
  featureToTab,
  featureFromTab,
} from '../utils/featureTabs'

export type THOpenedTabs = {
  onFeatureCloseRef:TOnFeatureCBRef
  onFeatureActiveRef:TOnFeatureCBRef
}

export const useOpenedTabs = (props:TEditorContainer, ext:THOpenedTabs) => {

  const {
    featuresRef,
    onTabDown:onTabDownCB,
    onTabLeave:onTabLeaveCB,
    onTabHover:onTabHoverCB,
  } = props

  const {
    onFeatureCloseRef,
    onFeatureActiveRef,
  } = ext

  const { feature, setFeature } = useFeature()

  const initialTabs = useMemo(() => {
    return feature ? [featureToTab(feature, { active: true })] : []
  }, [feature])

  const [openedTabs, setOpenedTabs] = useState<TTabItem[]>(initialTabs)

  const onActiveFeature = useCallback<TTabAction>((tab, ...rest) => {
    if(tab.uuid === feature.uuid) return

    const feat = featureFromTab(tab, featuresRef.current)

    const updatedTabs = setTabActive(openedTabs, tab)
    onFeatureActiveRef.current?.(feat, ...rest)

    setOpenedTabs(updatedTabs)
    setFeature(feat)

  }, [feature, openedTabs, setFeature])

  const onCloseFeature = useCallback<TTabAction>((tab, evt, ...rest) => {
    stopEvent(evt)

    const feat = featureFromTab(tab, featuresRef.current)
    onFeatureCloseRef.current?.(feat, ...rest)

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