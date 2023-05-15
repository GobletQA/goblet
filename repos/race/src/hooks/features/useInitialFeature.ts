import type { TRaceFeatureAsts, TRaceFeature } from '@GBR/types'

import { useMemo } from 'react'
import {isObj} from '@keg-hub/jsutils'

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
    if(!firstFeatureActive) return undefined
    if(feature && isObj<TRaceFeature>(feature)) return feature

    return isObj<TRaceFeatureAsts>(features)
      ? Object.values(features)[0]
      : undefined

  }, [])
}