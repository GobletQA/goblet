import type { TRequest, THeaders } from '@services/axios.types'


import { getBaseApiUrl } from './getBaseApiUrl'
import { addToast } from '@actions/toasts/addToast'
import { isObj, deepMerge } from '@keg-hub/jsutils'
import { localStorage } from '@services/localStorage'
import { signOutAuthUser } from '@actions/admin/provider/signOutAuthUser'
import { getRepoData, getContainerData } from '@utils/store/getStoreData'

/**
 * Helper to ensure the baseAPI url is added
 *
 */
export const buildUrl = (builtRequest:TRequest) => {
  return builtRequest.url.indexOf('/') !== 0
    ? builtRequest.url
    : `${getBaseApiUrl()}${builtRequest.url}`
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
export const formatRepoUrl = (repoName:string, url:string) => {
  return url.indexOf(`/repo`) === 0
    ? url
    : url[0] === `/`
    ? `/repo/${repoName}${url}`
    : `/repo/${repoName}/${url}`
}

/**
 * Check the response from the API for an expired session
 * If expired, sign out and open the sign in modal by calling signOutAuthUser
 * @param {boolean} success - True if the request was successful
 * @param {number} statusCode - Response code returned from the Backend API
 * @param {string} message - Response message returned from the Backend API
 * @param {boolean} showAlert - Should show failed alert message
 */
export const isValidSession = async (
  success:boolean,
  statusCode:number|undefined,
  message:string,
  showAlert:boolean
) =>{
  if(success || statusCode !== 401) return true

  showAlert &&
    addToast({ type: 'warn', message: message || `User session is expired, please sign in` })

  await signOutAuthUser()
}

/**
 * Pull the JWT from local storage and add it as a Bearer token
 * Is only added if it exists
 * @param {Object} headers - Existing headers to add to the request
 *
 * @return {Object} - Built headers object, with the JWT added if it exists
 */
export const buildHeaders = async (
  builtRequest:TRequest,
  type?: `api` | `screencast`
):Promise<THeaders> => {

  const routeHeaders = type !== `screencast`
    ? await localStorage.getHeaders()
    : getContainerData().screencast

  if(!routeHeaders && builtRequest.url.includes(`/repo`))
    console.log(`Missing Route headers for route ${builtRequest.url}`)

  const jwt = await localStorage.getJwt()

  return {
    // Add the headers to all api requests so we know how to route in the backend
   ...(routeHeaders || {}),
    ...builtRequest.headers,
   ...(jwt && { Authorization: `Bearer ${jwt}` }),
  }
}


export const buildRepoReq = (request:TRequest|string) => {
  const req = isObj<TRequest>(request) ? request : { url: request }

  const repoData = getRepoData()
  req.url = formatRepoUrl(repoData.name, req.url)
  
  return deepMerge<TRequest>(
    {
      params: {
        local: repoData?.git?.local,
        remote: repoData?.git?.remote,
        branch: repoData?.git?.branch,
      },
    },
    req
  )
}
