import type { TRaceFeatureAsts, TRaceFeature } from '@GBR/types'

import { useMemo } from 'react'
import { ESectionType } from '@GBR/types'

export type THInitialFeature = {
  feature?:TRaceFeature,
  features:TRaceFeatureAsts,
  firstFeatureActive?:boolean
}

export const useInitialFeature = ({
  feature,
  features,
  firstFeatureActive
}:THInitialFeature) => {
  return useMemo(() => {
    const initial = feature || (firstFeatureActive)
      ? Object.values(features)?.[0]
      : undefined

    return !initial ? initial : {...initial, type: ESectionType.feature} as TRaceFeature
  }, [])
}