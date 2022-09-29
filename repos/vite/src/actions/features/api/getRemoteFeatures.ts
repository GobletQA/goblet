import { addToast } from '@actions/toasts/addToast'
import { upsertFeatures } from '../local/upsertFeatures'
import { apiRepoRequest } from '@utils/api/apiRepoRequest'

/**
 * Calls the API backend to load the parsed feature definitions
 * Then calls upsertFeatures, to add them to the Store
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
