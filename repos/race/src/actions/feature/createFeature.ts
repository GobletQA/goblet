import type { TRaceFeature, TEmptyFeature } from '@GBR/types'

import { logNotFound } from '@GBR/utils/logging'
import { SetFeatureContextEvt } from '@GBR/constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { getEditor } from '@GBR/utils/editor/getEditor'
import { EmptyFeatureUUID } from '@GBR/constants/values'
import { featureFactory } from '@GBR/factories/featureFactory'

const getFeaturePath = async (feat:Partial<TEmptyFeature>, rootPrefix?:string) => {
  if(feat?.path) return feat?.path
  if(rootPrefix) return rootPrefix

  const { editor } = await getEditor()
  return editor.rootPrefix
}

export const createFeature = async (feat:Partial<TEmptyFeature>, rootPrefix?:string) => {
  
  const path = await getFeaturePath(feat, rootPrefix)
  if(!path?.length) return logNotFound(`Feature path`, `[Create Feature]`)

  const feature = featureFactory({
    uuid: EmptyFeatureUUID,
    ...feat,
    path,
  } as TEmptyFeature, true)

  /**
   * Uses the event system to call
   * the setEmptyFeature method defined in useFeatureCallbacks hook
   * The useFeatureCallbacks hook has a listener to the SetFeatureContextEvt event
   */
  EE.emit<TRaceFeature>(SetFeatureContextEvt, feature)

}