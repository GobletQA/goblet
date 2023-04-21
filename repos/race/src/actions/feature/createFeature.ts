import type { TRaceFeature, TEmptyFeature } from '@GBR/types'

import { logNotFound } from '@GBR/utils/logging'
import { SetFeatureContextEvt } from '@GBR/constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { EmptyFeatureUUID } from '@GBR/constants/values'
import { featureFactory } from '@GBR/factories/featureFactory'

export const createFeature = (feat:Partial<TEmptyFeature>, rootPrefix:string) => {
  if(!rootPrefix?.length) return logNotFound(`Root Prefix`, `[Create Feature]`)

  const feature = featureFactory({
    path: rootPrefix,
    uuid: EmptyFeatureUUID,
    ...feat,
  } as TEmptyFeature, true)

  /**
   * Uses the event system to call
   * the setEmptyFeature method defined in useFeatureCallbacks hook
   * The useFeatureCallbacks hook has a listener to the SetFeatureContextEvt event
   */
  EE.emit<TRaceFeature>(SetFeatureContextEvt, feature)

}