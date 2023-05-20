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

  const groups = useMemo(
    () => buildGroups({ rootPrefix, features: featuresRef.current }),
    [rootPrefix]
  )

  const [featureGroups, _setFeatureGroups] = useState<TRaceFeatures>(groups)

  const setFeatureGroups = useCallback((features:TRaceFeatures) => {
    featuresRef.current = features
    const groups = buildGroups({
      features,
      rootPrefix,
    })

  _setFeatureGroups(groups)

  }, [rootPrefix])

  return {
    featureGroups,
    setFeatureGroups,
  }
}
