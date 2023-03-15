import type { TUpdateFeature, TRaceFeature, TUpdateFeatureOpts } from '@GBR/types'

import { emptyObj, exists } from '@keg-hub/jsutils'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { UpdateFeatureContextEvt } from '@GBR/constants'

export const updateFeature = (
  feat:Partial<TRaceFeature>,
  updateOpts:TUpdateFeatureOpts=emptyObj
) => {
  !feat.feature
    ? console.warn(`A feature name is required when calling updateFeature action`, feat)
    : EE.emit<TUpdateFeature>(
        UpdateFeatureContextEvt,
        {
          feature: feat as TRaceFeature,
          ...updateOpts,
          replace: exists(updateOpts.replace) ? updateOpts.replace : true 
        }
      )
}