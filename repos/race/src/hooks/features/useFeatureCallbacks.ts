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
import type { MutableRefObject } from 'react'
import type { TExpanded, TOnExpandedCB } from '@GBR/contexts'

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
  expanded:TExpanded
  feature?:TRaceFeature
  setFeature:TSetFeature
  featuresRef: TFeaturesRef
  updateEmptyTab:TFeatureCB
  onFeatureSave:TOnFeatureCB
  onFeatureClose:TOnFeatureCB
  updateExpanded:TOnExpandedCB
  onFeatureChange?:TOnFeatureCB
  onFeatureActive?:TOnFeatureCB
  setFeatureRefs:TSetFeatureRefs
  onFeatureInactive?:TOnFeatureCB
  setFeatureGroups:TSetFeatureGroups
  curPathRef: MutableRefObject<string>
  curValueRef: MutableRefObject<string>
}

export const useFeatureCallbacks = (props:THFeatureCallbacks) => {

  const {
    feature,
    expanded,
    curPathRef,
    curValueRef,
    featuresRef,
    updateEmptyTab,
    setFeatureRefs,
    updateExpanded,
    onFeatureChange,
    onFeatureInactive,
    setFeature:_setFeature,
  } = props

  const setFeature = useInline((feat?:TRaceFeature, checkInactive:boolean=true) => {
    // If a different feature is being set,
    // then call inactive callback on previous feature
    checkInactive
      && feat?.uuid !== feature?.uuid
      && onFeatureInactive?.(feature, feat)

    curValueRef.current = feat?.content || ``
    curPathRef.current = feat?.parent?.location || ``

    _setFeature(feat)
  })

  const updateFeature = useInline(async ({
    options,
    feature:changed,
  }:TUpdateFeature) => {
    if(!changed || !isValidUpdate(changed)) return

    const updated = await ParkinWorker.reIndex({ feature: changed })

    onFeatureChange?.(updated, feature)

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
    setFeature(updated)
  })

  const setEmptyFeature = useInline(((feat:TRaceFeature) => {
    if(feat?.uuid === EmptyFeatureUUID){
      setFeatureRefs({ ...featuresRef.current, [EmptyFeatureUUID]: feat })
      updateEmptyTab?.(feat)
    }

    setFeature(feat, false)
  }) as TOnFeatureCB)

  // Listen to external events to update the feature context
  // Allows dispatching update outside of the react context
  useEventListen<TUpdateFeature>(
    UpdateFeatureContextEvt,
    ({ feature, options }) => updateFeature({
      options,
      feature: updateEmptyFeature(feature, featuresRef),
    })
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
    setFeature,
    updateFeature,
  }

}