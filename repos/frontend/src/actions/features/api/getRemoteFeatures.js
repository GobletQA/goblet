import { addToast } from 'GBActions/toasts/addToast'
import { upsertFeatures } from '../local/upsertFeatures'
import { apiRepoRequest } from 'GBUtils/api/apiRepoRequest'

/**
 * Calls the API backend to load the parsed feature definitions
 * Then calls upsertFeatures, to add them to the Store
 * @type function
 *
 * @returns {void}
 */
export const getRemoteFeatures = async () => {
  const {
    data,
    error,
    success
  } = await apiRepoRequest(`/features`)

  if (!success || error)
    return addToast({
      type: 'error',
      message: error || `Error loading Features, please try again later.`,
    })

  if(data.features) upsertFeatures(data.features)

  return data.features
}
