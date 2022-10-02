import type { AxiosResponse } from 'axios'
import type { TRequestError, TRequest, TBuiltRequest, TResponse } from '@services/axios.types'

import axios from 'axios'
import { deepFreeze, isStr } from '@keg-hub/jsutils'
import { HttpMethods, ENVIRONMENT } from '@constants'

const { GET, ...HttpMethodsWithBody } = HttpMethods

export const networkRequestModel = deepFreeze({
  method: HttpMethods.GET,
  url: null,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  responseType: 'json',
}) as TBuiltRequest

/**
 * object model used to parse response data from network call
 */
export const networkResponseModel = deepFreeze({
  data: {},
  success: false,
  statusCode: undefined,
  errorMessage: undefined,
}) as TResponse


/**
 * Builds the axios request model
 *
 */
const buildRequest = (request:TRequest|string) => {
  // ensures that request is an obj if request == str
  request = ((isStr(request) && { url: request }) || request) as TRequest
  const { params, ...requestOpt } = request

  // if request is anything other than GET, update the data property instead
  const method = request.method
  const dataTypeKey = method && HttpMethodsWithBody[method] ? 'data' : 'params'

  return {
    ...networkRequestModel,
    ...requestOpt,
    [dataTypeKey]: params,
    headers: {
      ...networkRequestModel.headers,
      ...requestOpt.headers,
    },
  } as TBuiltRequest
}

/**
 * Makes a network API request based on the passed in params
 * @param {networkRequestModel|string} request - request model || url
 * @param {Obj} [request.params] - querystring obj || body obj
 * @returns {networkResponse}
 */
export const networkRequest = async <T=Record<any, any>>(request:TRequest|string) => {
  try {
    // Built the request
    const builtRequest = buildRequest(request)

    // Log the request when in DEV environment
    ENVIRONMENT === `local` && console.log(`Network Request:\n`, builtRequest)

    // builds request and pull out the data and status property
    const { data, status } = await axios(builtRequest) as AxiosResponse<T>

    return {
      ...networkResponseModel,
      data,
      success: true,
      statusCode: status,
    } as TResponse
  }
  catch (err) {
    const { response, message } = (err as TRequestError)
    console.error(`[Axios#Request ERROR] - ${message}`)

    return {
      ...networkResponseModel,
      success: false,
      errorMessage: message,
      data: (response ? response.data : {}) as T,
      statusCode: response ? response.status : undefined,
    } as TResponse
  }
}
