import type { TUpdateFeature, TRaceFeature } from '@GBR/types'

import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { UpdateFeatureContextEvt } from '@GBR/constants'

export const updateFeature = (feat:Partial<TRaceFeature>, replace:boolean=true) => {
  !feat.feature
    ? console.warn(`A feature name is required when calling updateFeature action`, feat)
    : EE.emit<TUpdateFeature>(UpdateFeatureContextEvt, { feature: feat as TRaceFeature, replace})

}