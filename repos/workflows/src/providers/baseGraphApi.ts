import type {
  TGraphApiResp,
  TBaseGraphApi,
  TGraphApiVars,
  TGraphProvider,
  TGraphPageInfo,
  TRepoGraphRepos,
} from '@gobletqa/workflows/types'

import axios, { AxiosRequestConfig } from 'axios'
import { ApiCache } from './apiCache'
import { get } from '@keg-hub/jsutils/get'
import { Logger } from '@gobletqa/logger'
import { limbo } from '@keg-hub/jsutils/limbo'
import { isArr } from '@keg-hub/jsutils/isArr'
import { isFunc } from '@keg-hub/jsutils/isFunc'
import { hashObj } from '@keg-hub/jsutils/hashObj'
import { buildHeaders } from '../utils/buildHeaders'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'
import { hashString } from '@keg-hub/jsutils/hashString'

const defPageInfo:TGraphPageInfo = emptyObj as TGraphPageInfo

export class BaseGraphApi {

  cache: ApiCache
  provider: TGraphProvider

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
  callApi = async <T=any>(args:TGraphApiVars) => {
    const { token, headers, endpoint, getData, force } = args
    const {
      Query: query,
      Key:endpointKey,
    } = endpoint

    const variables = this.cache.buildVars(args, endpointKey)

    const userCachekey = args.userId
      || args.username && hashString(args.username)
      || args.subdomain

    // Disable cache for now until I can figure out why is failing
    const cacheKey = args.cacheKey || (userCachekey && `${endpointKey}-${userCachekey}-${hashObj(variables)}`)

    if(!force && cacheKey){
      const res = this.cache.checkResponse(cacheKey)
      if(res){
        Logger.log(`Found ${res?.length} cached repos`)
        return res as T[]
      }
      else Logger.log(`No cached repos found, making api call...`)
    }

    const opts = {
      method: `post`,
      url: this.provider.Url,
      data: {query, variables},
      headers: this.buildHeaders(token, headers),
    }

    const [err, resp] = await this.request(opts)
    this.apiError(err, resp?.data?.errors)

    const {
      nodes=emptyArr as T[],
      pageInfo=defPageInfo
    } = isFunc(getData)
      ? getData<T>(resp.data)
      : get(resp.data, endpoint.DataPath, emptyObj) as TGraphApiResp<T>

    if(pageInfo.hasNextPage && pageInfo.endCursor){
      this.cache.set(endpointKey, { after: pageInfo.endCursor })
      const moreNodes = await this.callApi<T>({
        ...args,
        cacheKey,
      }) as T[]

      return nodes.concat(moreNodes)
    }

    this.cache.reset(endpointKey)
    if(cacheKey) this.cache.cacheResponse(cacheKey, nodes)

    return nodes as T[]
  }

  repos = async <T>(opts:TRepoGraphRepos) => {
    return await this.callApi<T>({
      ...opts,
      endpoint: this.provider.Endpoints.Repo.ListAll,
    })
  }

}