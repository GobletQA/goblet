import type { TRaceFeature } from '@GBR/types'

import { UpdateFeatureContextEvt } from '@GBR/constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'


export const updateFeature = (feat:TRaceFeature) => {
  EE.emit<TRaceFeature>(UpdateFeatureContextEvt, feat)
}