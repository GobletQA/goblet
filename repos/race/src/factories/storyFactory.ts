import type { TRaceFeature, TBlockType } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { emptyObj } from '@keg-hub/jsutils'
import { blockFactory } from './blockFactory'
import { FeatureIndexMap } from '@GBR/constants'

export type TStoryMeta = {
  reason?: ESectionType.reason
  desire?: ESectionType.desire
  perspective?: ESectionType.perspective
}

export type TStoryFactory = {
  feature:TRaceFeature
  storyMeta?:TStoryMeta
  empty?:boolean
}

const addToObj = async (
  obj:Partial<TRaceFeature>,
  key:keyof TStoryMeta,
  value?:string,
  empty:boolean=false
) => {
  (empty || value)
    && (obj[key] = await blockFactory({
      feature: obj as TRaceFeature,
      block: {
        content: value || ``,
        type: key as TBlockType,
        index: FeatureIndexMap[key],
      }
    }))
}

export const storyFactory = async ({
  feature,
  storyMeta=emptyObj,
  empty=false
}:TStoryFactory) => {
  const {
    reason,
    desire,
    perspective
  } = storyMeta

  if(!empty && (!reason && !desire && !perspective)) return feature

  await addToObj(feature, ESectionType.reason, reason, empty)
  await addToObj(feature, ESectionType.desire, desire, empty)
  await addToObj(feature, ESectionType.perspective, perspective, empty)

  return feature
}