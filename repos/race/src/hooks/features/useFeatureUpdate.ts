import type {
  TFeatureCB,
  TSetFeature,
  TRaceFeature,
  TOnFeatureCB,
  TRaceFeatures,
  TUpdateFeature,
  TSetFeatureOpts,
  TOnFeatureItemCB,
  TSetTabsAndGroups,
  TSetFeatureGroups,
  TOnAuditFeatureCB,
  TUpdateFeatureOpts,
} from '@GBR/types'
import type { MutableRefObject } from 'react'
import type { TOnExpandedCB } from '@GBR/contexts'
import type { TExpanded } from '@GBR/hooks/editor/useExpanded'

import { emptyObj } from '@keg-hub/jsutils'
import { useInline } from '@gobletqa/components'
import { EmptyFeatureUUID } from '@GBR/constants/values'
import { addToGroup } from '@GBR/utils/features/addToGroup'
import { ParkinWorker } from '@GBR/workers/parkin/parkinWorker'
import { isValidUpdate } from '@GBR/utils/features/isValidUpdate'
import { updateFeatureInGroup } from '@GBR/utils/features/updateFeatureInGroup'
import { renameFeatureInGroup } from '@GBR/utils/features/renameFeatureInGroup'

export type TUpdateFeatureGroups = {
  updated:TRaceFeature
  feature?:TRaceFeature
  options: TUpdateFeatureOpts
  featureGroups:TRaceFeatures
  setTabsAndGroups:TSetTabsAndGroups
  setFeatureGroups:TSetFeatureGroups
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
  setFeatureGroups,
  // TODO: ensure tabs are updated when groups are updated
  setTabsAndGroups,
}:TUpdateFeatureGroups) => {
  const groupProps = { feature: updated, features: { items: featureGroups }}

  const groups = feature?.uuid === EmptyFeatureUUID
    ? addToGroup(groupProps)
    : options.rename
      ? renameFeatureInGroup({
          feature: updated,
          newLoc: updated.path,
          oldLoc: feature?.path as string,
          features: { items: featureGroups },
        })
      : updateFeatureInGroup(groupProps)

  // TODO:
  // Call this instead, with the features that were changed
  // That way we can know when tabs to update
  // setTabsAndGroups
  setFeatureGroups(groups.items)
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
    updateExpanded,
    updateEmptyTab,
    onAuditFeature,
    onFeatureChange,
    onFeatureCreate,
    onFeatureRename,
    setFeatureGroups,
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
    checkInactive
      && feat?.uuid !== feature?.uuid
      && onFeatureInactive?.(feature, feat)

    curPathRef.current = feat?.parent?.location || ``
    curValueRef.current = !curPathRef.current ? `` : feat?.content || ``

    // Only audit non-empty features
    feat
      && feat?.uuid !== EmptyFeatureUUID
      && await onAuditFeature(feat, opts)

    _setFeature(feat)
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
          setTabsAndGroups,
          setFeatureGroups,
        })

    // Ensure the tab name is updated when feature is empty
    feature?.uuid === EmptyFeatureUUID
      && updateEmptyTab?.(updated)

    options?.expand
      && updateExpanded(options?.expand)
  
    setFeature(updated, options)
  })

  return {
    setFeature,
    updateFeature
  }
}