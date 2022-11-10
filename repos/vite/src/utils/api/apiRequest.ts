import type { TRequest, TResponse } from '@services/axios.types'

import { networkRequest } from '@services/axios'
import { isObj, get, noOpObj } from '@keg-hub/jsutils'
import { buildUrl, isValidSession, buildHeaders } from './apiHelpers'

const buildRequest = async (request:TRequest|string) => {
  const builtRequest = isObj<TRequest>(request) ? { ...request } : { url: request } as TRequest

  // Add to ensure cookies get sent with the requests
  builtRequest.withCredentials = true
  builtRequest.url = buildUrl(builtRequest)
  builtRequest.headers = await buildHeaders(builtRequest)

  return builtRequest
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
  const builtRequest = await buildRequest(request)

  const {
    data,
    success,
    statusCode,
    errorMessage
  } = await networkRequest(builtRequest)

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
