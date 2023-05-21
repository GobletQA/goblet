import type { TTabAction, TTabItem, TTab } from '@gobletqa/components'
import type {
  TRaceFeature,
  TOnFeatureCB,
  TRaceFeatures,
  TOnEditFeature,
  TOnActiveFeature,
  TOnDeleteFeature,
  TOnCloseRaceTabEvt,
} from '@GBR/types'

import { useEditor } from '@GBR/contexts'
import { useCallback, useState } from 'react'
import { OnCloseRaceTabEvt } from '@GBR/constants/events'
import { useTabHooks } from '@GBR/hooks/tabs/useTabHooks'
import {
  useInline,
  stopEvent,
  useOnEvent,
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
  featureGroups:TRaceFeatures
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
    setOpenedTabs,
    featureGroups,
    onFeatureClose,
    onFeatureActive,
  } = props

  const { feature, setFeature, deleteFeature } = useEditor()

  const [editingName, setEditingName] = useState(``)

  const onEditFeature = useCallback<TOnEditFeature>((_, loc) => {
    ;(editingName !== loc || loc === ``)
      && setEditingName(loc)
  }, [editingName])

  const onTabClose = useInline<TTabAction>((tab, evt) => {
    evt && stopEvent(evt)

    const { tabs, active } = removeTab(openedTabs, tab)
    setOpenedTabs(tabs)

    const feat = featureFromTab(tab, featureGroups)
    const nextFeat = active ? featureFromTab(active?.tab, featureGroups) : active

    onFeatureClose?.(feat)
    nextFeat && onFeatureActive?.(nextFeat)

    setFeature(nextFeat)
  })

  useOnEvent<TOnCloseRaceTabEvt>(OnCloseRaceTabEvt, ({ tab }) => onTabClose(tab))

  const onDeleteFeature = useInline<TOnDeleteFeature>((__, loc) => deleteFeature?.(loc))

  /**
   * General hook for both sidebar and tab clicks on a feature
   */
  const onFeatureClick = useCallback<TOnActiveFeature|TTabAction>((
    arg1:TTab|Event,
    arg2?:TRaceFeature|Event
  ) => {
    const { tab, feature:feat } = normalizeArgs(featureGroups, arg1, arg2)

    const tabs = tab && setTabActive(openedTabs, tab)
    tabs && setOpenedTabs(tabs)

    if(feat?.uuid === feature?.uuid) return

    feat && onFeatureActive?.(feat)
    setFeature(feat)
  }, [
    feature,
    setFeature,
    openedTabs,
    setOpenedTabs,
    featureGroups,
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
    editingName,
    onEditFeature,
    onFeatureClick,
    onDeleteFeature,
  }
}
