import type { TTabItem } from '@gobletqa/components'

import type {
  TFeaturesRef,
  TRaceFeatures,
  TSetTabsAndGroups
} from '@GBR/types'

import { useMemo, useState, useCallback } from 'react'
import { buildGroups } from '@GBR/utils/features/buildGroups'
import { updateTabsFromGroups } from '@GBR/utils/features/updateTabsFromGroups'


export type THFeatureGroups = {
  rootPrefix:string
  openedTabs:TTabItem[]
  featuresRef: TFeaturesRef
  setOpenedTabs: (tabs:TTabItem[]) => void
}

export const useFeatureGroups = (props:THFeatureGroups) => {
  const {
    rootPrefix,
    openedTabs,
    featuresRef,
    setOpenedTabs
  } = props

  const groups = useMemo(
    () => buildGroups({ rootPrefix, features: featuresRef.current }),
    [rootPrefix]
  )

  const [featureGroups, _setFeatureGroups] = useState<TRaceFeatures>(groups)

  const setFeatureGroups = useCallback((features:TRaceFeatures, merge?:boolean) => {
    featuresRef.current = merge ? { ...featuresRef.current, ...features } : features

    const groups = buildGroups({
      rootPrefix,
      features: featuresRef.current,
    })

  _setFeatureGroups(groups)

  }, [rootPrefix])

  const setTabsAndGroups = useCallback<TSetTabsAndGroups>((
    changed,
    features,
    merge
  ) => {
    // Need to add a callback thats in the editor context
    // That allows updating tabs
    // I need to know what tabs to update
    // Which means I need to know which feature updated
    // const tabs = updateTabsFromGroups(featureGroups, groups, openedTabs)
    // tabs !== openedTabs && setOpenedTabs(tabs)

    features && setFeatureGroups(features, merge)
  }, [
    rootPrefix,
    openedTabs,
    setOpenedTabs,
    setFeatureGroups
  ])


  return {
    featureGroups,
    setTabsAndGroups,
    setFeatureGroups,
  }
}
