import type { TFeatureFileModel } from '@types'
import { featuresDispatch } from '@reducers'

/**
 * Dispatches the passed in features to the Store
 */
export const upsertFeatures = (features:TFeatureFileModel[]) => {
  featuresDispatch.upsertFeatures(features)
}
