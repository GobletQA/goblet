import type { TAnswerFeature, TWithFeatureCB } from '@GBR/types'

import { AskForFeatureEvt } from '@GBR/constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

/**
 * Helper to get the currently active feature from the context
 * Accepts a callback that will be called with the current feature context
 */
export const withFeature = (cb:TWithFeatureCB) => {
  EE.emit(AskForFeatureEvt, { cb })
}

/**
 * Helper to get the currently active feature from the context
 * Returns a promise that resolve to the current feature context
 */
export const getFeature = ():Promise<TAnswerFeature> => {
  return new Promise((res) => withFeature(res))
}