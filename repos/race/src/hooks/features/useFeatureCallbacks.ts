import type {
  TFeatureCB,
  TSetFeature,
  TRaceFeature,
  TOnFeatureCB,
  TFeaturesRef,
  TUpdateFeature,
  TAskForFeature,
  TSetFeatureRefs,
  TSetFeatureGroups,
} from '@GBR/types'

import { EmptyFeatureUUID } from '@GBR/constants/values'
import { ParkinWorker } from '@GBR/workers/parkin/parkinWorker'
import { useEventListen, useInline } from '@gobletqa/components'
import { isValidUpdate } from '@GBR/utils/features/isValidUpdate'
import { updateEmptyFeature } from '@GBR/utils/features/updateEmptyFeature'

import {
  AskForFeatureEvt,
  SetFeatureContextEvt,
  UpdateFeatureContextEvt,
} from '@GBR/constants'

export type THFeatureCallbacks = {
  rootPrefix:string
  feature?:TRaceFeature
  setFeature:TSetFeature
  featuresRef: TFeaturesRef
  updateEmptyTab:TFeatureCB
  onFeatureClose:TOnFeatureCB
  onFeatureChange?:TOnFeatureCB
  onFeatureActive?:TOnFeatureCB
  setFeatureRefs:TSetFeatureRefs
  onFeatureInactive?:TOnFeatureCB
  setFeatureGroups:TSetFeatureGroups
}

export const useFeatureCallbacks = (props:THFeatureCallbacks) => {

  const {
    feature,
    setFeature,
    featuresRef,
    updateEmptyTab,
    setFeatureRefs,
    onFeatureChange,
    onFeatureInactive,
  } = props

  const _setFeature = useInline((feat?:TRaceFeature) => {
    // If a different feature is being set,
    // then call inactive callback on previous feature
    feat?.uuid !== feature?.uuid && onFeatureInactive?.(feature)

    setFeature(feat)
  })

  const updateFeature = useInline(async (changed?:Partial<TRaceFeature>, replace?:boolean) => {
    if(!isValidUpdate(changed)) return

    const updated = await ParkinWorker.updateFeature(
      changed,
      feature,
      replace,
    )

    onFeatureChange?.(updated, changed, feature)

    featuresRef.current[updated.uuid] = updated

    // If the updated feature was an empty feature
    // Remove the temp empty feature, and update the tab name
    // So the tab has the correct feature title
    if(feature?.uuid === EmptyFeatureUUID){
      delete featuresRef.current[EmptyFeatureUUID]
      updateEmptyTab?.(updated)
    }

    setFeatureRefs(featuresRef.current)
    setFeature(updated)

  })

  const setEmptyFeature = useInline(((feat:TRaceFeature) => {
    if(feat?.uuid === EmptyFeatureUUID){
      setFeatureRefs({ ...featuresRef.current, [EmptyFeatureUUID]: feat })
      updateEmptyTab?.(feat)
    }

    _setFeature(feat)
  }) as TOnFeatureCB)

  // Listen to external events to update the feature context
  // Allows dispatching update outside of the react context
  useEventListen<TUpdateFeature>(
    UpdateFeatureContextEvt,
    ({ feature, replace }) => updateFeature(
      updateEmptyFeature(feature, featuresRef),
      replace
    )
  )

  useEventListen<TRaceFeature>(
    SetFeatureContextEvt,
    setEmptyFeature
  )

  // Helper to allow external code ask the context for the current feature
  // Allows external actions to interface with the currently active feature
  useEventListen<TAskForFeature>(AskForFeatureEvt, ({ cb }) => cb?.({
    feature,
    updateFeature,
  }))

  return {
    updateFeature,
    setFeature: setEmptyFeature,
  }

}