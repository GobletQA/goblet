import type { AxiosRequestConfig } from 'axios'
import type {
  TGraphApiResp,
  TBaseGraphApi,
  TGraphApiVars,
  TGraphProvider,
  TGraphPageInfo,
  TRepoGraphRepos,
} from '@GWF/types'

import axios from 'axios'
import { ApiCache } from './apiCache'
import { get } from '@keg-hub/jsutils/get'
import { ApiLogger } from '@GWF/utils/logger'
import { limbo } from '@keg-hub/jsutils/limbo'
import { isArr } from '@keg-hub/jsutils/isArr'
import { isFunc } from '@keg-hub/jsutils/isFunc'
import { hashObj } from '@keg-hub/jsutils/hashObj'
import { buildHeaders } from '../utils/buildHeaders'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'
import { hashString } from '@keg-hub/jsutils/hashString'

const defPageInfo:TGraphPageInfo = emptyObj as TGraphPageInfo

type TExtractNodes = TGraphApiVars & {
  
}

const extractNodes = <T>(args:TExtractNodes, resp:any) => {
  const { endpoint, getData } = args
  return isFunc(getData)
    ? getData<T>(resp.data)
    : get(resp.data, endpoint.DataPath, emptyObj) as TGraphApiResp<T>
}

const handleResponse = async <T>(
  graphApi:BaseGraphApi,
  resp:any,
  args:TExtractNodes,
  endpointKey:string,
  cacheKey,
) => {
  
  const {
    nodes=emptyArr as T[],
    pageInfo=defPageInfo
  } = extractNodes<T>(args, resp)
  
  if(pageInfo.hasNextPage && pageInfo.endCursor){
    ApiLogger.log(`More nodes exist, making call to get more nodes...`)
    graphApi.cache.set(endpointKey, { after: pageInfo.endCursor })
    const moreNodes = await graphApi.callApi<T>({
      ...args,
      cacheKey,
    }, true) as T[]

    return nodes.concat(moreNodes)
  }

  ApiLogger.log(`No more nodes exist, return pulled nodes`)
  return nodes
}


export class BaseGraphApi {

  cache: ApiCache
  provider: TGraphProvider
  cacheEnabled:boolean = true

  constructor(args:TBaseGraphApi){
    this.provider = args.provider
    this.cache = ApiCache.getInstance({
      variables: args.variables
    })
  }

  apiError = (err:Error|null, errors:Error|Error[]|null) => {
    if(err) throw err

    if(!errors) return

    const defMes = `Could not complete Git Provider API call. Please try again later`

    if(isArr<Error>(errors)){
      if(errors.length) throw new Error(errors[0].message || defMes)
    }
    else throw new Error(errors.message || defMes)
  }

  buildHeaders = (token:string, headers:Record<string, string>) => {
    return buildHeaders({
      token,
      headers,
      provider: this.provider
    })
  }

  request = async <T=any>(opts:AxiosRequestConfig) => await limbo<T>(axios(opts))

  /**
   * Calls Github's GraphQL API endpoint to get a list of a users repos
   */
  callApi = async <T=any>(args:TGraphApiVars, pageCall?:boolean) => {
    const { token, headers, endpoint, getData, force } = args
    const {
      Query: query,
      Key:endpointKey,
    } = endpoint

    const variables = this.cache.buildVars(args, endpointKey)

    const userCacheKey = args.userId
      || args.username && hashString(args.username)
      || args.subdomain

    // Disable cache for now until I can figure out why is failing
    const cacheKey = this.cacheEnabled
      ? args.cacheKey || (userCacheKey && `${endpointKey}-${userCacheKey}-${hashObj(variables)}`)
      : false

    if(!pageCall && !force && cacheKey){
      const res = this.cache.checkResponse(cacheKey)
      if(res){
        ApiLogger.log(`Found ${res?.length} cached repos`)
        return res as T[]
      }
      else ApiLogger.log(`No cached repos found, making api call...`)
    }

    const opts = {
      method: `post`,
      url: this.provider.Url,
      data: {query, variables},
      headers: this.buildHeaders(token, headers),
    }

    ApiLogger.log(`Calling git provider graph API: ${this.provider.Url}`)
    const [err, resp] = await this.request(opts)
    this.apiError(err, resp?.data?.errors)

    const allNodes = await handleResponse<T>(this, resp, args, endpointKey, cacheKey)

    if(pageCall) return allNodes

    this.cache.reset(endpointKey)
    if(this.cacheEnabled && cacheKey)
      if(cacheKey) this.cache.cacheResponse(cacheKey, allNodes)

    ApiLogger.log(`Pulled "${allNodes.length}" nodes from Git Provider`)
    return allNodes as T[]
  }

  repos = async <T>(opts:TRepoGraphRepos) => {
    ApiLogger.log(`Getting user repos...`)

    return await this.callApi<T>({
      ...opts,
      endpoint: this.provider.Endpoints.Repo.ListAll,
    })
  }

}