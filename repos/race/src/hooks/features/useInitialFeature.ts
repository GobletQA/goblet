import type { TRaceFeatureAsts, TFeatureLoc } from '@GBR/types'

import { useMemo } from 'react'
import {isObj} from '@keg-hub/jsutils'

export type THInitialFeature = {
  features?:TRaceFeatureAsts,
  firstFeatureActive?:boolean
  openedFeatures?:TFeatureLoc[]
}

export const useInitialFeature = ({
  features,
  openedFeatures,
  firstFeatureActive
}:THInitialFeature) => {
  return useMemo(() => {
    if(openedFeatures?.length && features)
      return features[openedFeatures[0]]

    if(!firstFeatureActive) return undefined

    return isObj<TRaceFeatureAsts>(features)
      ? Object.values(features)[0]
      : undefined

  }, [])
}
