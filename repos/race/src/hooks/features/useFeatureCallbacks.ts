import type { THFeatureUpdate } from './useFeatureUpdate'
import type { TUpdateFeature, TAskForFeature } from '@GBR/types'

import { useEmptyFeature } from './useEmptyFeature'
import { useFeatureUpdate } from './useFeatureUpdate'
import { EmptyFeatureUUID } from '@GBR/constants/values'
import { GetActiveFileEvent, useOnEvent } from '@gobletqa/components'
import { AskForFeatureEvt, UpdateFeatureContextEvt } from '@GBR/constants'
import { updateEmptyFeature } from '@GBR/utils/features/updateEmptyFeature'

export type THFeatureCallbacks = THFeatureUpdate & {}

export const useFeatureCallbacks = (props:THFeatureCallbacks) => {

  const {
    feature,
    curPathRef,
    curValueRef,
    featuresRef,
    setFeature:_setFeature,
  } = props

  const {
    setFeature,
    updateFeature
  } = useFeatureUpdate(props)

  useEmptyFeature({...props, setFeature})

  // Listen to external events to update the feature context
  // Allows dispatching update outside of the react context
  useOnEvent<TUpdateFeature>(UpdateFeatureContextEvt, ({ feature, options }) => {
    const isEmpty = feature.uuid === EmptyFeatureUUID
    const feat = isEmpty ? updateEmptyFeature(feature, featuresRef) : feature

    updateFeature({ options, feature: feat})
  })

  // Helper to allow external code ask the context for the current feature
  // Allows external actions to interface with the currently active feature
  useOnEvent<TAskForFeature>(AskForFeatureEvt, ({ cb }) => cb?.({
    feature,
    updateFeature,
  }))

  // Helper to allow external code ask the context for the current file
  // Similar to AskForFeature, but used outside of race editor
  useOnEvent(GetActiveFileEvent, ({ cb }) => cb?.({
    content: curValueRef.current,
    location: curPathRef.current
  }))

  return {
    setFeature,
    updateFeature,
  }

}