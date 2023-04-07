import type {
  TGraphApiResp,
  TBaseGraphApi,
  TGraphApiVars,
  TGraphProvider,
  TGraphPageInfo,
  TRepoGraphRepos,
} from '@gobletqa/workflows/types'

import axios from 'axios'
import { ApiCache } from './apiCache'
import { buildHeaders } from '../utils/buildHeaders'
import {
  get,
  limbo,
  isArr,
  isFunc,
  hashObj,
  emptyObj,
  emptyArr,
  deepMerge,
} from '@keg-hub/jsutils'

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

    const defMes = `Could not complete github.listRepos API call. Please try again later`

    if(isArr<Error[]>(errors)){
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

  /**
   * Calls Github's GraphQL API endpoint to get a list of a users repos
   */
  callApi = async <T=any>(args:TGraphApiVars) => {
    const { token, headers, endpoint, getData } = args
    const {
      Query: query,
      Key:endpointKey,
    } = endpoint

    const variables = this.cache.buildVars(args, endpointKey)

    const cacheKey = `${endpointKey}-${hashObj(variables)}`
    const res = this.cache.checkResponse(cacheKey)
    if(res) return res as T[]

    const opts = {
      method: `post`,
      url: this.provider.Url,
      data: {query, variables},
      headers: this.buildHeaders(token, headers),
    }

    const [err, resp] = await limbo(axios(opts))
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
      }) as T[]

      return nodes.concat(moreNodes)
    }

    this.cache.reset(endpointKey)
    this.cache.cacheResponse(cacheKey, nodes)

    return nodes as T[]
  }

  repos = async <T>(opts:TRepoGraphRepos) => {
    return await this.callApi<T>({
      ...opts,
      endpoint: this.provider.Endpoints.Repo.ListAll,
    })
  }

}