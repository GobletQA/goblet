import type {
  TFeaturesRef,
  TRaceFeatures,
  TSetFeatureRefs,
  TSetFeatureGroups,
} from '@GBR/types'

import { useMemo, useState, useCallback } from 'react'
import { buildGroups } from '@GBR/utils/features/buildGroups'
import {exists} from '@keg-hub/jsutils'

export type THFeatureGroups = {
  featuresRef: TFeaturesRef
}

export const useFeatureGroups = (props:THFeatureGroups) => {
  const { featuresRef } = props
  const [editingFeatureGroup, setEditingGroup] = useState<string|boolean>(false)

  const groups = useMemo(() => {
    const { groups } = buildGroups(featuresRef)
    return groups
  }, [])
  const [featureGroups, _setFeatureGroups] = useState<TRaceFeatures>(groups)

  const setFeatureGroups = useCallback((features:TRaceFeatures|TFeaturesRef) => {
    const feats = `current` in features ? features?.current : features

    const { groups, editingGroup } = buildGroups({ current: feats as TRaceFeatures })
    _setFeatureGroups(groups)

    exists<string|boolean>(editingGroup)
      && editingGroup !== editingFeatureGroup
      && setEditingGroup(editingGroup)
  }, [featureGroups])

  const setFeatureRefs = useCallback((features:TRaceFeatures) => {
    featuresRef.current = features
    setFeatureGroups(featuresRef)
  }, [setFeatureGroups])

  return {
    featureGroups,
    setFeatureRefs,
    setFeatureGroups,
    editingFeatureGroup
  }
}
