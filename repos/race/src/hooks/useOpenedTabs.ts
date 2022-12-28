import type { TRaceFeature, TFeaturesRef, TStepsRef, TRaceEditorProps } from '../types'
import type { TTabAction, TTabItem } from '../goblet'

import { setTabActive } from '../utils/setTabActive'
import { useMemo, useState, useCallback } from 'react'
import {
  removeTab,
  featureToTab,
  tabToFeature,
} from '../utils/featureTabs'

export type THOpenedTabs = {
  stepsRef: TStepsRef
  featuresRef:TFeaturesRef
  initialFeature?:TRaceFeature
}

export const useOpenedTabs = (props:TRaceEditorProps, ext:THOpenedTabs) => {

  const {
    onFeatureClose,
    onFeatureActive,
    onTabDown:onTabDownCB,
    onTabLeave:onTabLeaveCB,
    onTabHover:onTabHoverCB,
  } = props

  const {
    initialFeature
  } = ext

  const initialTabs = useMemo(() => {
    return initialFeature ? [featureToTab(initialFeature, { active: true })] : []
  }, [initialFeature])

  const [openedTabs, setOpenedTabs] = useState<TTabItem[]>(initialTabs)

  const onTabClick = useCallback<TTabAction>((evt, tab) => {
    const updatedTabs = setTabActive(openedTabs, tab)

    onFeatureActive?.(tabToFeature(tab))
    setOpenedTabs(updatedTabs)
  }, [openedTabs])

  const onTabClose = useCallback<TTabAction>((evt, tab) => {
    const updatedTabs = removeTab(openedTabs, tab)
    onFeatureClose?.(tabToFeature(tab))
    setOpenedTabs(updatedTabs)
  }, [openedTabs])

  const onTabHover = useCallback<TTabAction>((evt, tab, key) => {
    onTabHoverCB?.(evt, tab , key)
  }, [openedTabs])

  const onTabLeave = useCallback<TTabAction>((evt, tab, key) => {
    onTabLeaveCB?.(evt, tab, key)
  }, [openedTabs])

  const onTabDown = useCallback<TTabAction>((evt, tab, key) => {
    onTabDownCB?.(evt, tab, key)
  }, [openedTabs])

  return {
    onTabDown,
    onTabClose,
    openedTabs,
    onTabClick,
    onTabHover,
    onTabLeave,
    setOpenedTabs,
  }
}