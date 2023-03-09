import type { TRaceFeature } from '@GBR/types'

import { EmptyFeatureUUID } from '@GBR/constants/values'

export const isValidUpdate = (feat?:Partial<TRaceFeature>) => {
  if(!feat?.uuid)
    return console.error(`Can not update feature. The feature.uuid property is required.`)

  if(feat.uuid === EmptyFeatureUUID)
    return console.error(`Updated features should NOT have an empty uuid`)

  return true
}
