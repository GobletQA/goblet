import type { MutableRefObject } from 'react'
import type { TOnExpandedCB } from '@GBR/contexts'
import type { TExpanded } from '@GBR/hooks/editor/useExpanded'
import type {
  TFeatureCB,
  TSetFeature,
  TRaceFeature,
  TOnFeatureCB,
  TRaceFeatures,
  TOnFeatureEvt,
  TUpdateFeature,
  TGetOpenedTabs,
  TSetFeatureOpts,
  TOnFeatureItemCB,
  TSetTabsAndGroups,
  TSetFeatureGroups,
  TOnAuditFeatureCB,
  TUpdateFeatureOpts,
} from '@GBR/types'

import { emptyObj } from '@keg-hub/jsutils'
import { EmptyFeatureUUID } from '@GBR/constants/values'
import { RaceOnFeatureEvt } from '@GBR/constants/events'
import { addToGroup } from '@GBR/utils/features/addToGroup'
import { onEmitEvent, useInline } from '@gobletqa/components'
import { ParkinWorker } from '@GBR/workers/parkin/parkinWorker'
import { isValidUpdate } from '@GBR/utils/features/isValidUpdate'
import { updateFeatureInGroup } from '@GBR/utils/features/updateFeatureInGroup'
import { renameFeatureInGroup } from '@GBR/utils/features/renameFeatureInGroup'

export type TUpdateFeatureGroups = {
  updated:TRaceFeature
  feature?:TRaceFeature
  options: TUpdateFeatureOpts
  featureGroups:TRaceFeatures
  getOpenedTabs:TGetOpenedTabs
  setTabsAndGroups:TSetTabsAndGroups
}

export type TFeatureCBs = {
  feature?:TRaceFeature
  updated:TRaceFeature
  options: TUpdateFeatureOpts
  onFeatureCreate:TOnFeatureCB
  onFeatureChange?:TOnFeatureCB
  onFeatureRename:TOnFeatureItemCB
}

export type THFeatureUpdate = {
  rootPrefix:string
  expanded:TExpanded
  feature?:TRaceFeature
  setFeature:TSetFeature
  updateEmptyTab:TFeatureCB
  onFeatureSave:TOnFeatureCB
  onFeatureClose:TOnFeatureCB
  featureGroups:TRaceFeatures
  updateExpanded:TOnExpandedCB
  onFeatureCreate:TOnFeatureCB
  getOpenedTabs:TGetOpenedTabs
  onFeatureChange?:TOnFeatureCB
  onFeatureActive?:TOnFeatureCB
  onFeatureInactive?:TOnFeatureCB
  onAuditFeature:TOnAuditFeatureCB
  onFeatureRename:TOnFeatureItemCB
  setFeatureGroups:TSetFeatureGroups
  setTabsAndGroups:TSetTabsAndGroups
  curPathRef: MutableRefObject<string>
  curValueRef: MutableRefObject<string>
}

const updateGroups = ({
  options,
  updated,
  feature,
  featureGroups,
  getOpenedTabs,
  setTabsAndGroups,
}:TUpdateFeatureGroups) => {
  const tabs = getOpenedTabs()
  const groupProps = {
    tabs,
    feature: updated,
    old: feature || updated,
    features: { items: featureGroups }
  }

  const groups = feature?.uuid === EmptyFeatureUUID
    ? addToGroup(groupProps)
    : !options.rename
      ? updateFeatureInGroup(groupProps)
      : renameFeatureInGroup({
          tabs,
          feature: updated,
          old: feature || updated,
          features: { items: featureGroups },
        })

  setTabsAndGroups(groups)
}

const featureCallbacks = ({
  options,
  feature,
  updated,
  onFeatureCreate,
  onFeatureChange,
  onFeatureRename,
}:TFeatureCBs) => {
  options.create
    ? onFeatureCreate(updated)
    : options.rename
      ? onFeatureRename(updated, feature?.parent?.location, updated.content)
      : onFeatureChange?.(updated, feature)
}

export const useFeatureUpdate = (props:THFeatureUpdate) => {
  const {
    feature,
    curPathRef,
    curValueRef,
    featureGroups,
    getOpenedTabs,
    updateExpanded,
    updateEmptyTab,
    onAuditFeature,
    onFeatureChange,
    onFeatureCreate,
    onFeatureRename,
    onFeatureActive,
    setTabsAndGroups,
    onFeatureInactive,
    setFeature:_setFeature,
  } = props

  const setFeature = useInline(async (
    feat?:TRaceFeature,
    opts:TSetFeatureOpts=emptyObj as TSetFeatureOpts
  ) => {

    const { checkInactive=true } = opts

    // If a different feature is being set,
    // then call inactive callback on previous feature
    // Then call the feature active of the new feature
    if(feat?.uuid !== feature?.uuid){
      checkInactive && onFeatureInactive?.(feature, feat)
      onFeatureActive?.(feat)
    }

    curPathRef.current = feat?.parent?.location || ``
    curValueRef.current = !curPathRef.current ? `` : feat?.content || ``

    // Only audit non-empty features
    feat
      && feat?.uuid !== EmptyFeatureUUID
      && await onAuditFeature(feat, opts)

    // Dispatch an event anytime the feature is updated
    onEmitEvent<TOnFeatureEvt>(RaceOnFeatureEvt, { feature: feat })
    _setFeature(feat)

    return feat
  })

  const updateFeature = useInline(async ({
    options=emptyObj as TUpdateFeatureOpts,
    feature:changed,
  }:TUpdateFeature) => {

    if(!changed || !isValidUpdate(changed)) return

    const updated = options.reindex !== false
      ? await ParkinWorker.reIndex({ feature: changed })
      : changed

    options.callbacks !== false
      && featureCallbacks({
          options,
          updated,
          feature,
          onFeatureCreate,
          onFeatureChange,
          onFeatureRename,
        })

    options.groups !== false
      && updateGroups({
          options,
          updated,
          feature,
          featureGroups,
          getOpenedTabs,
          setTabsAndGroups,
        })

    // Ensure the tab name is updated when feature is empty
    feature?.uuid === EmptyFeatureUUID
      && updateEmptyTab?.(updated)

    options?.expand
      && updateExpanded(options?.expand)

    return setFeature(updated, options)
  })

  return {
    setFeature,
    updateFeature
  }
}