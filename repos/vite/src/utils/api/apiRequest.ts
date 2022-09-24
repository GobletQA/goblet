import type { THeaders, TRequest, TResponse } from '@services/axios.types'

import { getBaseApiUrl } from './getBaseApiUrl'
import { networkRequest } from '@services/axios'
import { addToast } from '@actions/toasts/addToast'
import { isObj, get, noOpObj } from '@keg-hub/jsutils'
import { localStorage } from '@services/localStorage'
import { signOutAuthUser } from '@actions/admin/provider/signOutAuthUser'

/**
 * Check the response from the API for an expired session
 * If expired, sign out and open the sign in modal by calling signOutAuthUser
 * @param {boolean} success - True if the request was successful
 * @param {number} statusCode - Response code returned from the Backend API
 * @param {string} message - Response message returned from the Backend API
 * @param {boolean} showAlert - Should show failed alert message
 */
const isValidSession = async (
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
const addHeaders = async (
  headers:THeaders=noOpObj as THeaders,
  routeHeaders:THeaders
):Promise<THeaders> => {

  const jwt = await localStorage.getJwt()

  return {
    // Add the headers to all api requests so we know how to route in the backend
   ...(routeHeaders || {}),
    ...headers,
   ...(jwt && { Authorization: `Bearer ${jwt}` }),
  }
}

/**
 * Helper to make api requests to the Backend API
 * @function
 * @export
 * @public
 * @param {Object} request - Arguments that define the request type to make
 *
 * @returns {Object|Boolean} - Data returned from the Backend API or false
 */
export const apiRequest = async <T=Record<any, any>>(
  request:TRequest|string
):Promise<TResponse<T>> => {
  const builtRequest = isObj<TRequest>(request) ? { ...request } : { url: request } as TRequest

  builtRequest.url =
    builtRequest.url.indexOf('/') !== 0
      ? builtRequest.url
      : `${getBaseApiUrl()}${builtRequest.url}`

  // Add to ensure cookies get sent with the requests
  builtRequest.withCredentials = true
  
  const routeHeaders = await localStorage.getHeaders()

  if(!routeHeaders && builtRequest.url.includes(`/repo`))
    console.log(`Missing Route headers for route ${builtRequest.url}`)

  builtRequest.headers = await addHeaders(builtRequest.headers, routeHeaders)

  const { data, success, statusCode, errorMessage } = await networkRequest(
    builtRequest
  )

  await isValidSession(
    success,
    statusCode,
    get(data, 'message', errorMessage),
    !builtRequest.url.endsWith(`/repo/status`)
  )

  return success
    ? { 
        data,
        success,
        statusCode,
      }
    : {
        data,
        success,
        statusCode,
        error: data?.message || errorMessage,
      }
}