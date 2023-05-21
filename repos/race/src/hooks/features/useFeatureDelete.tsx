import type { TTabItem } from '@gobletqa/components'
import type {
  TRaceFeature,
  TOnFeatureCB,
  TRaceFeatures,
  TSetTabsAndGroups,
  TRaceFeatureGroup,
  TSetFeatureGroups,
} from '@GBR/types'

import { EPatchType } from '@GBR/types'
import { useInline } from '@gobletqa/components'
import { featureFromLoc } from '@GBR/utils/features/featureFromLoc'
import { removeFromGroup } from '@GBR/utils/features/removeFromGroup'
import {
  removeTab,
  isTabMatch,
  featureFromTab,
} from '@GBR/utils/features/featureTabs'


export type THFeatureDelete = {
  feature?:TRaceFeature
  openedTabs:TTabItem[]
  setFeature:TOnFeatureCB
  featureGroups:TRaceFeatures
  onFeatureDelete?:TOnFeatureCB
  setTabsAndGroups:TSetTabsAndGroups
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
    setOpenedTabs,
    featureGroups,
    onFeatureDelete,
    setTabsAndGroups
  } = props

  return useInline<(loc:string)=>void>((loc) => {
    const remove = featureFromLoc({ features: featureGroups, loc }) as TRaceFeature

    if(!remove || (`items` in remove))
      return console.warn(
        `[Error Delete Feature] Can not delete feature. The location ${loc} does not exists`
      )

    // Check if the feature is opened as a tab, and if so remove it
    const tab = openedTabs.find(tb => isTabMatch(tb, remove))

    if(tab){
      const { tabs, active } = removeTab(openedTabs, tab.tab)
      setOpenedTabs(tabs)
      const nextFeat = active ? featureFromTab(active?.tab, featureGroups) : active

      setFeature(nextFeat)
    }
    else {
      // If the feature if active, then remove the active feature
      feature?.uuid === remove?.uuid && setFeature()
    }

    const removed = removeFromGroup({
      // tabs:openedTabs,
      uuid: remove?.uuid,
      path: remove?.path,
      featureGroups: { items: featureGroups } as TRaceFeatureGroup,
    })

    setTabsAndGroups(removed)

    // Finally call the onFeatureDelete callback
    onFeatureDelete?.(remove)
  })

}