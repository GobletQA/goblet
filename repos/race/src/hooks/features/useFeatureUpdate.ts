import type {
  TAuditOpts,
  TFeatureCB,
  TSetFeature,
  TRaceFeature,
  TOnFeatureCB,
  TFeaturesRef,
  TUpdateFeature,
  TSetFeatureRefs,
  TSetFeatureOpts,
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
import { ParkinWorker } from '@GBR/workers/parkin/parkinWorker'
import { isValidUpdate } from '@GBR/utils/features/isValidUpdate'

export type THFeatureUpdate = {
  rootPrefix:string
  expanded:TExpanded
  feature?:TRaceFeature
  setFeature:TSetFeature
  featuresRef: TFeaturesRef
  updateEmptyTab:TFeatureCB
  onFeatureSave:TOnFeatureCB
  onFeatureClose:TOnFeatureCB
  updateExpanded:TOnExpandedCB
  onFeatureCreate:TOnFeatureCB
  onFeatureChange?:TOnFeatureCB
  onFeatureActive?:TOnFeatureCB
  setFeatureRefs:TSetFeatureRefs
  onFeatureInactive?:TOnFeatureCB
  onAuditFeature:TOnAuditFeatureCB
  curPathRef: MutableRefObject<string>
  curValueRef: MutableRefObject<string>
}

export const useFeatureUpdate = (props:THFeatureUpdate) => {
  const {
    feature,
    curPathRef,
    curValueRef,
    featuresRef,
    updateEmptyTab,
    setFeatureRefs,
    updateExpanded,
    onAuditFeature,
    onFeatureChange,
    onFeatureCreate,
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

    featuresRef.current[updated.uuid] = updated

    // If the updated feature was an empty feature
    // Remove the temp empty feature, and update the tab name
    // So the tab has the correct feature title
    if(feature?.uuid === EmptyFeatureUUID){
      delete featuresRef.current[EmptyFeatureUUID]
      updateEmptyTab?.(updated)
    }

    options?.expand && updateExpanded(options?.expand)
    setFeatureRefs(featuresRef.current)
    setFeature(updated, options)
  })
 
  return {
    setFeature,
    updateFeature
  }
}