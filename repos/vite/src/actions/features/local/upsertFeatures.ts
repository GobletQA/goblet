import type { TFeatureFileModelList } from '@types'
import { featuresDispatch } from '@store'

/**
 * Dispatches the passed in features to the Store
 */
export const upsertFeatures = (features:TFeatureFileModelList) => {
  featuresDispatch.upsertFeatures(features)
}
