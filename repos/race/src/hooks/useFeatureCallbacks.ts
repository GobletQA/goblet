import type { TTabAction, TTab } from '../goblet'
import type {
  TSetFeature,
  TRaceFeature,
  TOnFeatureCB,
  TOnFeatureCBRef,
  TOnReturnFeatureCBRef,
} from '../types'

import { useCallback } from 'react'

import { deepMerge } from '@keg-hub/jsutils'

export type THFeatureCallbacks = {
  feature?:TRaceFeature
  setFeature:TSetFeature
  onFeatureCloseRef:TOnFeatureCBRef
  onFeatureActiveRef:TOnFeatureCBRef
  onFeatureChangeRef:TOnFeatureCBRef
  onFeatureInactiveRef:TOnFeatureCBRef
  onFeatureBeforeChangeRef:TOnReturnFeatureCBRef
}

export const useFeatureCallbacks = (props:THFeatureCallbacks) => {

  const {
    feature,
    setFeature,
    onFeatureChangeRef,
    onFeatureInactiveRef,
    onFeatureBeforeChangeRef
  } = props

  const _setFeature = useCallback(async (feat?:TRaceFeature) => {
    if(feat?.uuid === feature?.uuid) return

    setFeature(feat)
    onFeatureInactiveRef?.current?.(feature)

  }, [feature])

  const updateFeature = useCallback(async (feat?:TRaceFeature) => {
    if(feat?.uuid === feature?.uuid) return

    const merged = deepMerge<TRaceFeature>(feature, feat)
    const beforeMdl = await onFeatureBeforeChangeRef.current?.(merged, feat, feature)

    const updated = beforeMdl || merged

    onFeatureChangeRef.current?.(updated, feat, feature)
    setFeature(updated)
  }, [feature])

  return {
    updateFeature,
    setFeature: _setFeature,
  }

}