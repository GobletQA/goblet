import type { TRaceFeature } from '@GBR/types'

import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { UpdateFeatureContextEvt } from '@GBR/constants'


export const updateFeature = (feat:TRaceFeature) => {
  !feat.feature
    ? console.warn(`Can not update a feature without a feature name`, feat)
    : EE.emit<TRaceFeature>(UpdateFeatureContextEvt, feat)
}