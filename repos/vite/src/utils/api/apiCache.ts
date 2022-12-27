import type { TRequest } from '@services/axios.types'

import { noOpObj, hashObj } from '@keg-hub/jsutils'

export type TCacheMethod = (...args:any[]) => any

export type TApiCache = {
  [key:string]: {
    expires:Date
    response?: any
    requesting?: boolean
    cacheMethods: TCacheMethod[]
  }
}

const API_CACHE = {} as TApiCache

export const getCacheKey = (request:TRequest) => hashObj(request)

export const getCacheExpireTime = (time = 10) => {
  const date = new Date()
  date.setSeconds(date.getSeconds() + time)
  return date
}

export const isCacheExpired = (expires: Date): boolean => new Date() >= expires

export const getApiCache = (endpoint:keyof TApiCache) => {
  if(!API_CACHE[endpoint]) return false

  const { requesting, expires, response } = API_CACHE[endpoint]

  if(isCacheExpired(expires)){
    delete API_CACHE[endpoint]
    return false
  }

  if(requesting) return requesting

  return response
}

export const addCacheMethod = (endpoint:keyof TApiCache, method:TCacheMethod) => {
  API_CACHE[endpoint]?.cacheMethods?.push(method)
}

export const setApiRequest = (endpoint:keyof TApiCache, expires?:number) => {
  API_CACHE[endpoint] = {
    ...(API_CACHE[endpoint] || noOpObj as TApiCache),
    requesting: true,
    expires: getCacheExpireTime(expires),
  }
}

export const setApiResponse = <T=any>(endpoint:keyof TApiCache, res:T, expires?:number) => {
  const cacheMethods = API_CACHE[endpoint]?.cacheMethods

  cacheMethods?.length
    && cacheMethods?.forEach(method => method?.(res))

  API_CACHE[endpoint] = {
    response: res,
    cacheMethods: [],
    requesting: false,
    expires: getCacheExpireTime(expires),
  }
}