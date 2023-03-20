import type { TRaceFeature, TWithFeatureCB } from '@GBR/types'

import { AskForFeatureEvt } from '@GBR/constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

export type TGetFeature = {
  feature:TRaceFeature
}

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
export const getFeature = async (
  parent?:TRaceFeature,
):Promise<TGetFeature> => {
  return (parent && `feature` in parent)
    ? { feature: parent }
    : await new Promise<TGetFeature>((res) => withFeature(
        ({ feature }) => res({ feature }))
      )
}