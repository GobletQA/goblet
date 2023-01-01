import type { TTabAction, TTab } from '@gobletqa/components'
import type {
  TSetFeature,
  TRaceFeature,
  TOnFeatureCBRef,
  TSetFeatureGroups,
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
    if(feat?.uuid === feature?.uuid) return

    setFeature(feat)
    onFeatureInactiveRef?.current?.(feature)

  }, [feature])

  const updateFeature = useCallback(async (feat?:TRaceFeature) => {
    if(feat?.uuid === feature?.uuid) return

    const merged = deepMerge<TRaceFeature>(feature, feat)
    const beforeMdl = await onFeatureBeforeChangeRef.current?.(merged, feat, feature)

    const updated = beforeMdl || merged

    // TODO: update feature groups here if needed?
    onFeatureChangeRef.current?.(updated, feat, feature)
    setFeature(updated)
  }, [feature, setFeatureGroups])

  return {
    updateFeature,
    setFeature: _setFeature,
  }

}