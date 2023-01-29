import type { TRaceFeature } from '@GBR/types'

import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { UpdateFeatureContextEvt } from '@GBR/constants'

export const updateFeature = (feat:Partial<TRaceFeature>) => {
  // TODO: @lance-tipton - Add this back when done building RaceEditor
  // Change check from feat.uuid to feat.feature
  !feat.uuid
    ? console.warn(`A feature name is required when calling updateFeature action`, feat)
    : EE.emit<Partial<TRaceFeature>>(UpdateFeatureContextEvt, feat)

}