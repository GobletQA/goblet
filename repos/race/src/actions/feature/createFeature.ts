import type { TRaceFeature, TEmptyFeature } from '@GBR/types'

import { SetFeatureContextEvt } from '@GBR/constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { EmptyFeatureUUID } from '@GBR/constants/values'
import { featureFactory } from '@GBR/factories/featureFactory'

export const createFeature = (feat:TEmptyFeature, rootPrefix:string) => {
  if(!rootPrefix?.length)
    return console.warn(`Root location is required to create a new feature`)

  const feature = featureFactory({
    path: rootPrefix,
    uuid: EmptyFeatureUUID,
    ...feat,
  }, true)

  EE.emit<TRaceFeature>(SetFeatureContextEvt, feature)

}