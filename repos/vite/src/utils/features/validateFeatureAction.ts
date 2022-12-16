import type { TFeatureFileModel, TFeatureAst } from '@types'

import { getStore } from '@store'


type TValidActResp = {
  index: number
  feature?: TFeatureFileModel
}

/**
 * Logs warning message, and returns noop object
 * @function
 */
const emptyResponse = (message:string, ...extra:any[]) => {
  console.warn(message, ...extra)
  return { index: -1 } as TValidActResp
}

/**
 * Validates a feature exists within the store and has the correct properties
 * Checks property based on the passed in type param
 * @function
 *
 * @return {Object} - Object containing the store features, items, and validated feature
 */
export const validateFeatureAction = (
  feature:TFeatureFileModel,
  type:keyof TFeatureAst
):TValidActResp => {
  if (!feature || !feature?.ast[type])
    return emptyResponse(
      `The ${type} does not exist on the feature.`,
      feature,
      type
    )

  const { features } = getStore()?.getState()
  if (!features || !features.files)
    return emptyResponse(`No features exist in the store!`, features.files)

  // Validate Object.values is needed here. This type my be incorrect
  const index = Object.values(features.files).findIndex(
    feat => feat?.ast?.feature
      && feature?.ast?.feature
      && feat?.ast?.feature === feature?.ast?.feature
  )
  if (index === -1)
    return emptyResponse(`Feature does not exist in the store!`, features.files)

  return {
    index,
    feature
  }
}
