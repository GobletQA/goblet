import type { TRaceFeature } from '@GBR/types'
import { emptyObj } from '@keg-hub/jsutils'
import { blockFactory } from './blockFactory'
import { FeatureIndexMap } from '@GBR/constants'

export type TStoryMeta = {
  reason?: string
  desire?: string
  perspective?: string
}

export type TStoryFactory = {
  storyMeta?:TStoryMeta
  empty?:boolean
}

const addToObj = (
  obj:Partial<TRaceFeature>,
  key:keyof TStoryMeta,
  value?:string,
  empty:boolean=false
) => {
  (empty || value)
    && (obj[key] = blockFactory({ block: { content: value || ``, index: FeatureIndexMap[key] }}))
}

export const storyFactory = ({
  storyMeta=emptyObj,
  empty=false
}:TStoryFactory) => {
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