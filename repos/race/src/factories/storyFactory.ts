import type { TRaceFeature } from '@GBR/types'
import { emptyObj } from '@keg-hub/jsutils'
import { blockFactory } from './blockFactory'
import { FeatureIndexMap } from '@GBR/constants'

export type TStoryMeta = {
  reason?: string
  desire?: string
  perspective?: string
}

const addToObj = (
  obj:Partial<TRaceFeature>,
  key:keyof TStoryMeta,
  value?:string,
  empty:boolean=false
) => {
  (empty || value)
    && (obj[key] = blockFactory({ content: value || ``, index: FeatureIndexMap[key] }))
}

export const storyFactory = (
  storyMeta:TStoryMeta=emptyObj,
  empty:boolean=false
) => {
  const {
    reason,
    desire,
    perspective
  } = storyMeta

  const feature:Partial<TRaceFeature> = {}

  if(!empty && (!reason && !desire && !perspective)) return feature
  
  addToObj(feature, `reason`, reason, empty)
  addToObj(feature, `desire`, desire, empty)
  addToObj(feature, `perspective`, perspective, empty)

  return feature
}