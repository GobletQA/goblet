import type { TTabAction, TTabItem } from '@gobletqa/components'
import type {
  TRaceFeature,
  TOnFeatureCB,
  TEditorContainer,
} from '../types'

import { useFeature } from '../contexts'
import { stopEvent } from '@gobletqa/components'
import { setTabActive } from '../utils/featureTabs'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { UpdateEmptyFeatureTabEvt } from '@GBR/constants/events'

import { useMemo, useState, useCallback, useEffect } from 'react'
import {
  removeTab,
  featureToTab,
  featureFromTab,
} from '../utils/featureTabs'

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
    return feature ? [featureToTab(feature, { active: true })] : []
  }, [feature])

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

  useEffect(() => {

    const updateOff = EE.on<TRaceFeature>(
      UpdateEmptyFeatureTabEvt,
      (updated) => {
        const cleaned = openedTabs.filter(tab => Boolean(tab.tab.uuid))
        const updatedTabs = setTabActive(cleaned, updated)
        setOpenedTabs(updatedTabs)
      }
    )

    return () => {
      updateOff?.()
    }
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