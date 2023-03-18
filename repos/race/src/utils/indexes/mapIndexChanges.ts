import type { TRaceFeature } from '@GBR/types'

import { dataMappers } from './dataMappers'
import { deepEqual, exists, isFunc } from '@keg-hub/jsutils'

type TFeatureKey = keyof TRaceFeature
type TFeatureProp = TRaceFeature[TFeatureKey]
type TMapFunc = (current: TFeatureProp, update:TFeatureProp) => TFeatureProp


const doEqlCheck = (
  key:TFeatureKey,
  current:TFeatureProp,
  updated:TFeatureProp,
) => {
  const mapFunc = dataMappers[key as keyof typeof dataMappers] as TMapFunc

  if(isFunc(mapFunc)){
    const resp = mapFunc(current, updated)
    return resp === current ? undefined : resp
  }

  return deepEqual(current, updated) ? undefined : updated
}

/**
 * TODO: validate that this is working as expected
 */
export const mapIndexChanges = (
  feature:TRaceFeature,
  updated:Partial<TRaceFeature>,
) => {
  
  return Object.entries(updated)
    .reduce((acc, [key, prop]) => {

      // TODO: if the prop is removed from updated
      // It won't show up here, so need a pattern for tracking that
      if(!exists<TFeatureProp>(prop)){
        return acc
      }

      const current = feature[key as keyof typeof feature] as TFeatureProp
      const hasCurrent = exists<TFeatureProp>(current)

      if(!hasCurrent){
        acc[key] = prop
        return acc
      }

      const resp = doEqlCheck(key as TFeatureKey, current, prop)
      exists(resp) && (acc[key] = resp)

      return acc
    }, {} as Record<string, TFeatureProp>) as Partial<TRaceFeature>

}