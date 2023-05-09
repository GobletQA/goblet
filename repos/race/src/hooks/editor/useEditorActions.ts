import type { TTabAction, TTabItem, TTab } from '@gobletqa/components'
import type {
  TRaceFeature,
  TFeaturesRef,
  TOnFeatureCB,
  TRaceFeatures,
  TOnEditFeature,
  TOnActiveFeature,
  TOnDeleteFeature,
} from '@GBR/types'

import { useCallback } from 'react'
import { useEditor } from '@GBR/contexts'
import { useTabHooks } from '@GBR/hooks/tabs/useTabHooks'

import {
  useInline,
  stopEvent,
} from '@gobletqa/components'
import {
  removeTab,
  featureToTab,
  setTabActive,
  featureFromTab,
} from '@GBR/utils/features/featureTabs'

export type THEditorActions = {
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

const normalizeArgs = (
  features:TRaceFeatures,
  arg1:TTab|Event,
  arg2?:TRaceFeature|Event,
) => {
  let tab:TTab|undefined=undefined
  let feature:TRaceFeature|undefined=undefined
  let event:Event|undefined=undefined

  if(`feature` in arg1){
    tab = arg1 as TTab
    event = arg2 as Event
  }
  else {
    event = arg1 as Event
    feature = arg2 as TRaceFeature
  }

  if(!tab && feature) tab = featureToTab(feature, { active: true}).tab
  if(!feature && tab) feature = featureFromTab(tab, features)

  return {
    tab,
    event,
    feature
  }
}

export const useEditorActions = (props:THEditorActions) => {

  const {
    openedTabs,
    featuresRef,
    setOpenedTabs,
    onFeatureClose,
    onFeatureActive,
  } = props

  const { feature, setFeature } = useEditor()

 // TODO: update these to actually change the file
  const onEditFeature = useCallback<TOnEditFeature>(() => {
    console.log(`------- editing feature -------`)
  }, [])
  
  const onDeleteFeature = useCallback<TOnDeleteFeature>(() => {
    console.log(`------- delete feature -------`)
  }, [])

  const onTabClose = useInline<TTabAction>((tab, evt) => {
    stopEvent(evt)

    const { tabs, active } = removeTab(openedTabs, tab)
    setOpenedTabs(tabs)

    const feat = featureFromTab(tab, featuresRef.current)
    const nextFeat = active ? featureFromTab(active?.tab, featuresRef.current) : active

    onFeatureClose?.(feat)
    setFeature(nextFeat)
    nextFeat && onFeatureActive?.(nextFeat)
  })

  /**
   * General hook for both sidebar and tab clicks on a feature
   */
  const onFeatureClick = useCallback<TOnActiveFeature|TTabAction>((
    arg1:TTab|Event,
    arg2?:TRaceFeature|Event
  ) => {
    const { tab, feature:feat } = normalizeArgs(featuresRef.current, arg1, arg2)

    const tabs = tab && setTabActive(openedTabs, tab)
    tabs && setOpenedTabs(tabs)

    if(feat?.uuid === feature?.uuid) return

    setFeature(feat)
    feat && onFeatureActive?.(feat)
  }, [
    feature,
    setFeature,
    openedTabs,
    setOpenedTabs,
    onFeatureActive
  ])
  
  const {
    onTabDown,
    onTabHover,
    onTabLeave,
  } = useTabHooks(props)

  return {
    onTabDown,
    onTabHover,
    onTabLeave,
    onTabClose,
    onEditFeature,
    onFeatureClick,
    onDeleteFeature,
  }
}
