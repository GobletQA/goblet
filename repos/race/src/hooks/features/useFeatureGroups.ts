import type {
  TFeaturesRef,
  TRaceFeatures,
} from '@GBR/types'

import {exists} from '@keg-hub/jsutils'
import { useMemo, useState, useCallback } from 'react'
import { buildGroups } from '@GBR/utils/features/buildGroups'

export type THFeatureGroups = {
  rootPrefix:string
  featuresRef: TFeaturesRef
}

export const useFeatureGroups = (props:THFeatureGroups) => {
  const { rootPrefix, featuresRef } = props
  
  const [editingFeatureGroup, setEditingGroup] = useState<string|boolean>(false)

  const groups = useMemo(() => {
    const { groups } = buildGroups({ featuresRef, rootPrefix })
    return groups
  }, [])
  const [featureGroups, _setFeatureGroups] = useState<TRaceFeatures>(groups)

  const setFeatureRefs = useCallback((features:TRaceFeatures) => {
    featuresRef.current = features
    const { groups, editingGroup } = buildGroups({
      rootPrefix,
      featuresRef: { current: features }
    })

  _setFeatureGroups(groups)

  exists<string|boolean>(editingGroup)
    && editingGroup !== editingFeatureGroup
    && setEditingGroup(editingGroup)
  }, [
    rootPrefix,
    editingFeatureGroup
  ])

  return {
    featureGroups,
    setFeatureRefs,
    setEditingGroup,
    editingFeatureGroup
  }
}
