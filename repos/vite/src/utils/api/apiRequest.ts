import type { TBuiltRequest, TRequest, TResponse } from '@services/axios.types'

import { networkRequest } from '@services/axios'
import { isObj, get, isBool } from '@keg-hub/jsutils'
import { buildUrl, isValidSession, buildHeaders } from './apiHelpers'
import {
  getCacheKey,
  getApiCache,
  setApiRequest,
  setApiResponse,
  addCacheMethod,
} from './apiCache'


const buildRequest = async <T>(request:TBuiltRequest<T>|string) => {
  const builtRequest = isObj<TBuiltRequest<T>>(request)
    ? { ...request }
    : { url: request } as TBuiltRequest<T>

  // Add to ensure cookies get sent with the requests
  builtRequest.withCredentials = true
  builtRequest.url = buildUrl<T>(builtRequest)
  builtRequest.headers = await buildHeaders<T>(builtRequest)

  return builtRequest
}

/**
 * Helper to make api requests to the Backend API
 * @function
 */
export const apiRequest = async <T=Record<any, any>, R=Record<any, any>>(
  request:TBuiltRequest<R>|string
):Promise<TResponse<T>> => {
  const builtRequest = await buildRequest<R>(request)

  const cacheKey = getCacheKey(builtRequest)
  const cache = getApiCache(cacheKey)

  if(!isBool(cache)) return cache as TResponse<T>
  else if(cache === true)
    return new Promise(res => addCacheMethod(cacheKey, (data:TResponse<T>) => res(data)))

  setApiRequest(cacheKey)

  const {
    data,
    success,
    statusCode,
    errorMessage
  } = await networkRequest(builtRequest)

  const response = success
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

  setApiResponse<TResponse<T>>(cacheKey, response)

  await isValidSession(
    success,
    statusCode,
    get(data, 'message', errorMessage),
    !builtRequest.url.endsWith(`/repo/status`)
  )

  return response as TResponse<T>
}
