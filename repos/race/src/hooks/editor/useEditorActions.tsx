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

import { useEditor } from '@GBR/contexts'
import { useCallback, useState } from 'react'
import { useTabHooks } from '@GBR/hooks/tabs/useTabHooks'
import { toggleConfirm } from '@GBR/actions/general/toggleConfirm'

import {
  RedText,
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
  onFeatureDelete?:TOnFeatureCB
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
    onFeatureDelete,
  } = props

  const { feature, setFeature } = useEditor()

  const [editingName, setEditingName] = useState(``)

  const onEditFeature = useCallback<TOnEditFeature>((_, loc) => {
    ;(editingName !== loc || loc === ``)
      && setEditingName(loc)
  }, [editingName])
 
  const onDeleteFeature = useCallback<TOnDeleteFeature>((__, loc) => {
    const feature = featuresRef.current[loc] as TRaceFeature
    toggleConfirm({
      state: true,
      title: `Delete Feature`,
      text: (
        <>
          Are you sure your want to delete feature <b><RedText>{feature.feature}</RedText></b>?
        </>
      ),
      actions: [
        {
          text: `No`,
          color: `error`,
          variant:`contained`,
          onClick: () => toggleConfirm({ state: false }),
        },
        {
          text: `Yes`,
          color: `success`,
          variant:`contained`,
          onClick: () => {
            // Close the modal
            toggleConfirm({ state: false })

            // TODO: remove the feature within race,
            //  - Remove from feature
            //  - Then update featureRefs
            //  - And remove from tabs if it's open
            // 
            // Then Call the callback to save the feature on backend
            //  - If file only has one feature, then delete entire file
            onFeatureDelete?.(feature)
          },
        },
      ],
    })
  }, [onFeatureDelete])

  const onTabClose = useInline<TTabAction>((tab, evt) => {
    stopEvent(evt)

    const { tabs, active } = removeTab(openedTabs, tab)
    setOpenedTabs(tabs)

    const feat = featureFromTab(tab, featuresRef.current)
    const nextFeat = active ? featureFromTab(active?.tab, featuresRef.current) : active

    onFeatureClose?.(feat)
    nextFeat && onFeatureActive?.(nextFeat)

    setFeature(nextFeat)
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

    feat && onFeatureActive?.(feat)
    setFeature(feat)
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
    editingName,
    onEditFeature,
    onFeatureClick,
    onDeleteFeature,
  }
}
