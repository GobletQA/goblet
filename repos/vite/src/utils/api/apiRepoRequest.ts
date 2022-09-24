import type { TStateKey, TRepoState } from '@reducers'
import type { THeaders, TRequest, TResponse } from '@services/axios.types'

import { getStore } from '@store'
import { STORAGE } from '@constants'
import { apiRequest } from './apiRequest'
import { isObj, deepMerge, noOpObj } from '@keg-hub/jsutils'


/**
 * Helper to get the repo name form the store
 * @function
 * @private
 *
 */
const getRepoData = () => {
  const storeItems = getStore()?.getState()
  const key:TStateKey = STORAGE.REPO

  return (storeItems[key] || noOpObj) as TRepoState
}

/**
 * Helper to add the /repo/repoName to the request url
 * @function
 * @private
 * @param {string} repoName - Name of the repo
 * @param {string} url - Request url to add the path to
 *
 * @returns {string} - Url with the /repo/repoName prepended to it
 */
const formatUrl = (repoName:string, url:string) => {
  return url.indexOf('/repo') === 0
    ? url
    : url[0] === '/'
    ? `/repo/${repoName}${url}`
    : `/repo/${repoName}/${url}`
}

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
export const apiRepoRequest = async (request:TRequest|string) => {
  const req = isObj<TRequest>(request) ? request : { url: request }

  const repoData = getRepoData()
  req.url = formatUrl(repoData.name, req.url)

  return apiRequest(deepMerge(
    {
      params: {
        local: repoData?.git?.local,
        remote: repoData?.git?.remote,
      },
    },
    req
  ))
}
