
import type {
  TSetFeature,
  TRaceFeature,
  TOnFeatureCB,
  TFeaturesRef,
  TSetFeatureRefs,
  TSetFeatureGroups,
  TOnReturnFeatureCB,
} from '../types'


import { deepMerge } from '@keg-hub/jsutils'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { EmptyFeatureUUID } from '@GBR/constants/values'
import { useEffectOnce, useInline } from '@gobletqa/components'
import { updateEmptyFeature } from '@GBR/utils/features/updateEmptyFeature'
import {
  SetFeatureContextEvt,
  UpdateFeatureContextEvt,
  UpdateEmptyFeatureTabEvt
} from '@GBR/constants'

export type THFeatureCallbacks = {
  rootPrefix:string
  feature?:TRaceFeature
  setFeature:TSetFeature
  featuresRef: TFeaturesRef
  onFeatureClose:TOnFeatureCB
  onFeatureChange:TOnFeatureCB
  onFeatureActive:TOnFeatureCB
  onFeatureInactive:TOnFeatureCB
  setFeatureRefs:TSetFeatureRefs
  setFeatureGroups:TSetFeatureGroups
  onBeforeFeatureChange:TOnReturnFeatureCB
}

export const useFeatureCallbacks = (props:THFeatureCallbacks) => {

  const {
    feature,
    setFeature,
    featuresRef,
    setFeatureRefs,
    onFeatureChange,
    onFeatureInactive,
    onBeforeFeatureChange
  } = props

  const _setFeature = useInline(async (feat?:TRaceFeature) => {
    setFeature(feat)
    feat?.uuid !== feature?.uuid
      && onFeatureInactive?.(feature)

  })

  const updateFeature = useInline(async (feat?:TRaceFeature) => {
    if(!feat?.uuid)
      return console.warn(`Can not update feature. The feature.uuid property is required.`)

    const merged = deepMerge<TRaceFeature>(feature, feat)
    const beforeMdl = await onBeforeFeatureChange?.(merged, feat, feature)

    const updated = beforeMdl || merged
    featuresRef.current[updated.uuid] = updated

    setFeatureRefs(featuresRef.current)

    onFeatureChange?.(updated, feat, feature)

    // Update the opened empty feature tab, with the updated feature data
    // Ensure the tab name is correct
    feature?.uuid === EmptyFeatureUUID
     && EE.emit<TRaceFeature>(UpdateEmptyFeatureTabEvt, updated)

    setFeature(updated)

  })


  // Listen to external events to update the feature context
  // Allows dispatching update outside of the react context
  useEffectOnce(() => {

    const updateOff = EE.on<TRaceFeature>(
      UpdateFeatureContextEvt,
      (feat) => updateFeature(updateEmptyFeature(feat, featuresRef))
    )

    const setOff = EE.on<TRaceFeature>(
      SetFeatureContextEvt,
      _setFeature
    )

    return () => {
      updateOff?.()
      setOff?.()
    }
  })



  return {
    updateFeature,
    setFeature: _setFeature,
  }

}