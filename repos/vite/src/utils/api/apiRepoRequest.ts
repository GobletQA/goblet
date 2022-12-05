import type { TRequest } from '@services/axios.types'

import { apiRequest } from './apiRequest'
import { formatRepoUrl } from './apiHelpers'
import { isObj, deepMerge } from '@keg-hub/jsutils'
import { getRepoData } from '@utils/store/getStoreData'

/**
 * Wrapper to append /repo/repoName to a request url
 * Helps to name space request to a specific repo on the backend
 * @function
 * @export
 * @public
 * @param {Object} request - Arguments that define the request type to make
 * @param {string|boolean} responseType - Type of response returned on error. default is false
 *
 * @returns {Object|Boolean} - Data returned from the apiRequest method
 */
export const apiRepoRequest = async <T=Record<any, any>>(request:TRequest|string) => {
  const req = isObj<TRequest>(request) ? request : { url: request }

  const repoData = getRepoData()
  req.url = formatRepoUrl(repoData.name, req.url)

  return apiRequest<T>(deepMerge(
    {
      params: {
        local: repoData?.git?.local,
        remote: repoData?.git?.remote,
        branch: repoData?.git?.branch,
      },
    },
    req
  ))
}
