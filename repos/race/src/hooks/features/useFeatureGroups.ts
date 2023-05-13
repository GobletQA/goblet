import type { TFeaturesRef, TRaceFeatures, TSetFeatureGroups, TSetFeatureRefs } from '@GBR/types'

import { useMemo, useState, useCallback } from 'react'
import { buildGroups } from '@GBR/utils/features/buildGroups'

export type THFeatureGroups = {
  featuresRef: TFeaturesRef
}

export const useFeatureGroups = (props:THFeatureGroups) => {
  const { featuresRef } = props
  const groups = useMemo(() => buildGroups(featuresRef), [])
  const [featureGroups, _setFeatureGroups] = useState<TRaceFeatures>(groups)

  const setFeatureGroups = useCallback((features:TRaceFeatures|TFeaturesRef) => {
    const feats = `current` in features ? features?.current : features
    
    const groups = buildGroups({ current: feats as TRaceFeatures })
    _setFeatureGroups(groups)
  }, [featureGroups])

  const setFeatureRefs = useCallback((features:TRaceFeatures) => {
    featuresRef.current = features
    setFeatureGroups(featuresRef)
  }, [setFeatureGroups])

  return [
    featureGroups,
    setFeatureRefs,
    setFeatureGroups,
  ] as [TRaceFeatures, TSetFeatureGroups, TSetFeatureRefs]
}
