import type {
  TFeatureCB,
  TSetFeature,
  TRaceFeature,
  TOnFeatureCB,
  TRaceFeatures,
  TUpdateFeature,
  TSetFeatureGroups,
  TSetFeatureOpts,
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
  setFeatureGroups:TSetFeatureGroups
  curPathRef: MutableRefObject<string>
  curValueRef: MutableRefObject<string>
}

export const useFeatureUpdate = (props:THFeatureUpdate) => {
  const {
    feature,
    curPathRef,
    curValueRef,
    featureGroups,
    updateExpanded,
    onAuditFeature,
    onFeatureChange,
    onFeatureCreate,
    updateEmptyTab,
    setFeatureGroups,
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

    const updated = await ParkinWorker.reIndex({ feature: changed })

    options.create ? onFeatureCreate(updated) : onFeatureChange?.(updated, feature)

    const groups = feature?.uuid === EmptyFeatureUUID
      ? addToGroup({ feature: updated, features: { items: featureGroups }})
      : updateFeatureInGroup({feature: updated, features: { items: featureGroups }})

    // If the updated feature was an empty feature
    // Update the tab name, so the tab has the correct feature title
    feature?.uuid === EmptyFeatureUUID
      && updateEmptyTab?.(updated)

    options?.expand && updateExpanded(options?.expand)
    setFeatureGroups(groups.items)
    setFeature(updated, options)
  })
 
  return {
    setFeature,
    updateFeature
  }
}