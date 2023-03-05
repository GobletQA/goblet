import type { TRaceFeatureAsts, TRaceFeature } from '@GBR/types'

import { useMemo } from 'react'

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
  return useMemo(() => feature || (firstFeatureActive ? Object.values(features)?.[0] : undefined), [])
}