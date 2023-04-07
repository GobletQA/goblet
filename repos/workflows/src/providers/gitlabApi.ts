import type { AxiosRequestConfig } from 'axios'
import type {
  TApiConf,
  TGitOpts,
  TRepoResp,
  TGitApiRes,
  TBranchMeta,
  TRepoApiMeta,
  TBuildApiUrl,
  TGitReqHeaders,
  TGitCreateRepoOpts,
  TGitCreateBranchCof,
} from '@gobletqa/workflows/types'

import { Rest } from '../constants'
import axios, { AxiosError, } from 'axios'
import { BaseRestApi } from './baseRestApi'
import {
  isArr,
  isStr,
  limbo,
  emptyObj,
  deepMerge,
  ensureArr,
} from '@keg-hub/jsutils'

// curl --header "Authorization: Bearer <token>" "https://gitlab.com/api/v4/projects"
export class GitlabApi extends BaseRestApi {

  static createRepo = async (args:TGitCreateRepoOpts):Promise<TRepoApiMeta> => {
    return undefined
  }

  constructor(gitOpts:TGitOpts){
    super(gitOpts, Rest.Gitlab)
  }

  _callApi = async <T=TGitApiRes>(
    params:string|string[]|Partial<AxiosRequestConfig>,
    conf:TApiConf=emptyObj
  ) => {

    const args = isStr(params) || isArr(params)
      ? { url: params }
      : params

    const url = GitlabApi.buildAPIUrl({
      prePath: `repos`,
      remote: this.baseUrl,
      host: Rest.Gitlab.Url,
      pathExt: ensureArr(args.url)
    })

    const { cache, error:throwErr } = conf

    if(cache !== false && this._cache[url]) return this._cache[url] as [AxiosError, T]

    const config = deepMerge<AxiosRequestConfig>({
      method: 'GET',
      headers: this.headers,
    }, args, { url })
    
    const [err, resp] = await limbo<T, AxiosError>(axios(config))
    const axiosRes = [err, resp] as [AxiosError, T]

    if(cache !== false) this._cache[url] = axiosRes as [AxiosError, T]

    if(resp || !err || !throwErr) return axiosRes as [AxiosError, T]
    
    const error = err?.response?.data as Error
    this.throwError(error, url)

    return axiosRes as [AxiosError, T]
  }

  getRepo = async (repo:string):Promise<TRepoApiMeta> => {
    // TODO: the repo name is already part of the base URL
    // If we ever need to get the repo meta for a different repo
    // Then we need to override the base url and build it with the passed in repo name
    // For now, just pass an empty string
    const [err, resp] = await this._callApi<TRepoResp>('')
    return resp.data
  }
  
  defaultBranch = async (repoName:string) => {
    return undefined
  }

  getBranch = async (branch:string):Promise<false | void | TBranchMeta> => {
    return undefined
  }

  createBranch = async (newBranch:string, { from, hash }:TGitCreateBranchCof):Promise<string> => {
    return undefined
  }

  branchHash = async (branch:string):Promise<string | void> => {
    return undefined
  }

}
