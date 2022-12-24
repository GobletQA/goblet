import type {
  TSetFeature,
  TRaceFeature,
  TOnFeatureCBRef,
  TOnReturnFeatureCBRef,
} from '../types'

import { useCallback } from 'react'

import { deepMerge } from '@keg-hub/jsutils'

export type THFeatureCallbacks = {
  feature?:TRaceFeature
  setFeature:TSetFeature
  onFeatureChangeRef:TOnFeatureCBRef
  onFeatureUpdateRef:TOnFeatureCBRef
  onFeatureBeforeChangeRef:TOnReturnFeatureCBRef
}

export const useFeatureCallbacks = (props:THFeatureCallbacks) => {

  const {
    feature,
    setFeature,
    onFeatureChangeRef,
    onFeatureUpdateRef,
    onFeatureBeforeChangeRef
  } = props

  const _setFeature = useCallback(async (feat?:TRaceFeature) => {
    if(feat?.uuid === feature?.uuid) return

    const beforeMdl = await onFeatureBeforeChangeRef.current?.(feat, feature)
    const updated = beforeMdl || feat
    
    setFeature(updated)
    onFeatureChangeRef.current?.(updated)

  }, [feature?.uuid])

  const updateFeature = useCallback(async (feat?:TRaceFeature) => {
    if(feat?.uuid === feature?.uuid) return

    const merged = deepMerge<TRaceFeature>(feature, feat)
    const beforeMdl = await onFeatureBeforeChangeRef.current?.(merged, feat, feature)

    const updated = beforeMdl || merged

    onFeatureUpdateRef.current?.(updated, feat, feature)
    setFeature(updated)
  }, [feature])

  return {
    updateFeature,
    setFeature: _setFeature,
  }

}