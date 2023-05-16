import type { TUpdateFeature, TRaceFeature, TUpdateFeatureOpts } from '@GBR/types'

import { emptyObj, exists } from '@keg-hub/jsutils'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { UpdateFeatureContextEvt } from '@GBR/constants'

export const updateFeature = (
  feat:Partial<TRaceFeature>,
  options:TUpdateFeatureOpts=emptyObj as TUpdateFeatureOpts
) => {
  !feat.feature
    ? console.warn(`A feature name is required when calling updateFeature action`, feat)
    : EE.emit<TUpdateFeature>(
        UpdateFeatureContextEvt,
        {
          feature: feat as TRaceFeature,
          options: {
            ...options,
            replace: exists(options.replace) ? options.replace : true 
          },
        }
      )
}