
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
  onFeatureChange?:TOnFeatureCB
  onFeatureActive?:TOnFeatureCB
  setFeatureRefs:TSetFeatureRefs
  onFeatureInactive?:TOnFeatureCB
  setFeatureGroups:TSetFeatureGroups
  onBeforeFeatureChange?:TOnReturnFeatureCB
}

const updateFeaturesRef = (
  updated:TRaceFeature,
  featuresRef:TFeaturesRef,
  setFeatureRefs:TSetFeatureRefs,
  feature?:TRaceFeature,
) => {

  featuresRef.current[updated.uuid] = updated

  const wasEmpty = feature?.uuid === EmptyFeatureUUID
  // Remove the empty feature from the feature refs
  // It's now replaced with the updated feature
  if(wasEmpty) delete featuresRef.current[EmptyFeatureUUID]

  setFeatureRefs(featuresRef.current)

  // This is the second call to the opened tabs
  // Update the opened empty feature tab, with the updated feature data
  // Ensure the tab name is correct
  wasEmpty && EE.emit<TRaceFeature>(UpdateEmptyFeatureTabEvt, updated)
}

const mergeFeatureChanges = async (
  feat?:TRaceFeature,
  feature?:TRaceFeature,
  onBeforeFeatureChange?:TOnReturnFeatureCB
) => {
  const merged = deepMerge<TRaceFeature>(feature, feat)
  const beforeMdl = await onBeforeFeatureChange?.(merged, feat, feature)
  return beforeMdl || merged
}

const isValidUpdate = (feat?:TRaceFeature) => {
  if(!feat?.uuid)
    return console.error(`Can not update feature. The feature.uuid property is required.`)

  // This should never happen, but show a error message just incase, so we can fix it
  if(feat.uuid === EmptyFeatureUUID)
    return console.error(`Updated features should NOT have an empty uuid`)

  return true
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

  const _setFeature = useInline((feat?:TRaceFeature) => {
    // If a different feature is being set,
    // then call inactive callback on previous feature
    feat?.uuid !== feature?.uuid && onFeatureInactive?.(feature)

    setFeature(feat)
  })

  const updateFeature = useInline(async (feat?:TRaceFeature) => {
    if(!isValidUpdate(feat)) return

    const updated = await mergeFeatureChanges(feat, feature, onBeforeFeatureChange)

    onFeatureChange?.(updated, feat, feature)
    updateFeaturesRef(updated, featuresRef, setFeatureRefs, feature)

    setFeature(updated)

  })

  const setEmptyFeature = useInline(((feat:TRaceFeature) => {
    if(feat?.uuid === EmptyFeatureUUID){
      setFeatureRefs({ ...featuresRef.current, [EmptyFeatureUUID]: feat })
      // This should be the first call to update the opened tabs
      // Adding the empty feature tab
      EE.emit<TRaceFeature>(UpdateEmptyFeatureTabEvt, feat)
    }

    _setFeature(feat)
  }) as TOnFeatureCB)

  // Listen to external events to update the feature context
  // Allows dispatching update outside of the react context
  useEffectOnce(() => {

    const updateOff = EE.on<TRaceFeature>(
      UpdateFeatureContextEvt,
      (feat) => updateFeature(updateEmptyFeature(feat, featuresRef))
    )

    const setOff = EE.on<TRaceFeature>(
      SetFeatureContextEvt,
      setEmptyFeature
    )

    return () => {
      updateOff?.()
      setOff?.()
    }
  })


  return {
    updateFeature,
    setFeature: setEmptyFeature,
  }

}