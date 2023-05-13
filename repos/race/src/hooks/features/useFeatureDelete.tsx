import type { TTabAction, TTabItem, TTab } from '@gobletqa/components'
import type {
  TRaceFeature,
  TFeaturesRef,
  TOnFeatureCB,
  TSetFeatureRefs,
} from '@GBR/types'

import { useInline } from '@gobletqa/components'
import {
  removeTab,
  isTabMatch,
  featureFromTab,
} from '@GBR/utils/features/featureTabs'

export type THFeatureDelete = {
  openedTabs:TTabItem[]
  featuresRef:TFeaturesRef
  onFeatureActive?:TOnFeatureCB
  onFeatureDelete?:TOnFeatureCB
  setFeatureRefs:TSetFeatureRefs
  setOpenedTabs:(tabs:TTabItem[]) => void
}

export const useFeatureDelete = (props:THFeatureDelete) => {

  const {
    openedTabs,
    featuresRef,
    setOpenedTabs,
    setFeatureRefs,
    onFeatureDelete,
    onFeatureActive,
  } = props

  return useInline<(loc:string)=>void>((loc) => {
    const feature = featuresRef.current[loc] as TRaceFeature

    // Update feature refs to creates the sidebar feature groups
    const feats = {...featuresRef.current}
    delete feats[feature.uuid]
    setFeatureRefs(feats)

    // Check if the feature is opened as a tab, and if so remove it
    const tab = openedTabs.find(tb => isTabMatch(tb, feature))

    if(tab){
      const { tabs, active } = removeTab(openedTabs, tab.tab)
      setOpenedTabs(tabs)
      const nextFeat = active ? featureFromTab(active?.tab, featuresRef.current) : active
      nextFeat && onFeatureActive?.(nextFeat)
    }

    // Finally call the onFeatureDelete callback
    onFeatureDelete?.(feature)
  })


}