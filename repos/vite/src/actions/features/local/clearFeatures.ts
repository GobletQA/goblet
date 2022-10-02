import { featuresDispatch } from '@store'

/**
 * Dispatches an update to clear out all features by resetting the state to an empty object
 */
export const clearFeatures = () => {
  featuresDispatch.clear()
}
