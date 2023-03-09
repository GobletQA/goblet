import type { TFeatureFileModelList } from '@types'
import { filesDispatch } from '@store'

/**
 * Dispatches the passed in features to the Store
 */
export const upsertFeatures = (features:TFeatureFileModelList) => {
  filesDispatch.addFiles(features)
}
