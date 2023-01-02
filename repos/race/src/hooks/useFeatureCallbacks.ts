
import type {
  TSetFeature,
  TRaceFeature,
  TOnFeatureCBRef,
  TSetFeatureGroups,
  TOnReturnFeatureCBRef,
} from '../types'

import { useCallback } from 'react'
import { deepMerge } from '@keg-hub/jsutils'
import { useEffectOnce } from '@gobletqa/components'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { SetFeatureContextEvt, UpdateFeatureContextEvt } from '@GBR/constants'

export type THFeatureCallbacks = {
  feature?:TRaceFeature
  setFeature:TSetFeature
  onFeatureCloseRef:TOnFeatureCBRef
  onFeatureActiveRef:TOnFeatureCBRef
  onFeatureChangeRef:TOnFeatureCBRef
  onFeatureInactiveRef:TOnFeatureCBRef
  setFeatureGroups:TSetFeatureGroups
  onFeatureBeforeChangeRef:TOnReturnFeatureCBRef
}

export const useFeatureCallbacks = (props:THFeatureCallbacks) => {

  const {
    feature,
    setFeature,
    setFeatureGroups,
    onFeatureChangeRef,
    onFeatureInactiveRef,
    onFeatureBeforeChangeRef
  } = props

  const _setFeature = useCallback(async (feat?:TRaceFeature) => {
    setFeature(feat)

    feat?.uuid !== feature?.uuid
      && onFeatureInactiveRef?.current?.(feature)

  }, [feature])

  const updateFeature = useCallback(async (feat?:TRaceFeature) => {
    if(!feat?.uuid)
      return console.warn(`Can not update feature. The feature.uuid property is required.`)

    const merged = deepMerge<TRaceFeature>(feature, feat)
    const beforeMdl = await onFeatureBeforeChangeRef.current?.(merged, feat, feature)

    const updated = beforeMdl || merged

    // TODO: update feature groups here if needed?
    onFeatureChangeRef.current?.(updated, feat, feature)
    setFeature(updated)
  }, [feature, setFeatureGroups])


  // Listen to external events to update the feature context
  // Allows dispatching update outside of the react context
  useEffectOnce(() => {

    const updateOff = EE.on<TRaceFeature>(
      UpdateFeatureContextEvt,
      updateFeature
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