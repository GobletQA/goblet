import type { TRaceFeature, TWithFeatureCB } from '@GBR/types'

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
export const getFeature = (parent?:TRaceFeature):TRaceFeature|Promise<TRaceFeature> => {
  return parent && `feature` in parent
    ? parent
    : new Promise((res) => withFeature(({ feature }) => res(feature)))
}