import type { TTabAction, TTabItem, TTab } from '@gobletqa/components'
import type {
  TRaceFeature,
  TFeaturesRef,
  TOnFeatureCB,
  TSetFeatureGroups,
} from '@GBR/types'

import { useInline } from '@gobletqa/components'
import {
  removeTab,
  isTabMatch,
  featureFromTab,
} from '@GBR/utils/features/featureTabs'

export type THFeatureDelete = {
  feature?:TRaceFeature
  openedTabs:TTabItem[]
  setFeature:TOnFeatureCB
  featuresRef:TFeaturesRef
  onFeatureActive?:TOnFeatureCB
  onFeatureDelete?:TOnFeatureCB
  setFeatureGroups:TSetFeatureGroups
  setOpenedTabs:(tabs:TTabItem[]) => void
}

/**
 * If only one feature exists, and it's deleted the race editor container should clear out
 * but it keeps the deleted files content
 */
export const useFeatureDelete = (props:THFeatureDelete) => {

  const {
    feature,
    openedTabs,
    setFeature,
    featuresRef,
    setOpenedTabs,
    onFeatureDelete,
    onFeatureActive,
    setFeatureGroups,
  } = props

  return useInline<(loc:string)=>void>((loc) => {
    const remove = featuresRef.current[loc] as TRaceFeature

    if(!remove)
      return console.warn(
        `[Error Delete Feature] Can not delete feature. The location ${loc} does not exists`
      )

    // Check if the feature is opened as a tab, and if so remove it
    const tab = openedTabs.find(tb => isTabMatch(tb, remove))

    if(tab){
      const { tabs, active } = removeTab(openedTabs, tab.tab)
      setOpenedTabs(tabs)
      const nextFeat = active ? featureFromTab(active?.tab, featuresRef.current) : active
      nextFeat && onFeatureActive?.(nextFeat)

      setFeature(nextFeat)
    }
    else {
      // If the feature if active, then remove the active feature
      feature?.uuid === remove?.uuid && setFeature()
    }

    // Update feature refs to creates the sidebar feature groups
    delete featuresRef.current[remove.uuid]
    setFeatureGroups(featuresRef.current)

    // Finally call the onFeatureDelete callback
    onFeatureDelete?.(remove)
  })


}