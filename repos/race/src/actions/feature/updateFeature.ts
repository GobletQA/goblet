import type { TRaceFeature, TFeaturesRef } from '@GBR/types'

import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { UpdateFeatureContextEvt } from '@GBR/constants'
import { updateEmptyFeature } from '@GBR/utils/features/updateEmptyFeature'


export const updateFeature = (feat:TRaceFeature, featuresRef:TFeaturesRef) => {
  if(!feat.feature)
    return console.warn(`Can not update a feature without a feature name`, feat)

  const feature = updateEmptyFeature(feat, featuresRef.current)

  EE.emit<TRaceFeature>(UpdateFeatureContextEvt, feature)
}