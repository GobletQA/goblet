import type { AxiosRequestConfig } from 'axios'
import type {
  TGitOpts,
  TGitApiRes,
  TGitApiConf,
  TBranchMeta,
  TRepoApiMeta,
  TBuildApiUrl,
  IGitApiStatic,
  TGitReqHeaders,
  StaticImplements,
  TGitCreateRepoOpts,
  TGitCreateBranchCof,
} from '@gobletqa/workflows/types'

import url from 'url'
import path from 'path'
import { AxiosError } from 'axios'
import { emptyObj, emptyArr } from '@keg-hub/jsutils'

const throwOverrideErr = (message?:string) => {
  throw new Error(message || `Git Provider method must be overridden by an extending Class`)
}

export class BaseGitApi implements StaticImplements<IGitApiStatic, typeof BaseGitApi> {
  baseUrl:string
  headers:Record<string, string>
  options:Omit<TGitOpts, `token`|`remote`>
  _cache: Record<string, [AxiosError, Record<any, any>]>={}

  static host:string
  static globalHeaders:TGitReqHeaders

  /**
   * Logs a Git Provider API error message
   */
  static error = (message:string, ...args:any[]) => {
    console.log(...args)
    throw new Error(message)
  }

  static createRepo = async (args:TGitCreateRepoOpts):Promise<TRepoApiMeta> => {
    throwOverrideErr()
    return undefined
  }

  static buildHeaders = (token:string, headers?:TGitReqHeaders) => {
    return {
      [`Content-Type`]: `application/json`,
      ...this.globalHeaders,
      ...(token && { Authorization: `token ${token}` }),
      ...headers,
    }
  }

  static buildAPIUrl = (args:TBuildApiUrl) => {
    const {
      remote,
      prePath=``,
      postPath=``,
      host=this.host,
      pathExt=emptyArr,
    } = args

    const repoUrl = new url.URL(remote)
    repoUrl.host = host
    repoUrl.pathname = path.join(prePath, repoUrl.pathname, postPath, ...pathExt)

    return repoUrl.toString()
  }

  constructor(gitOpts:TGitOpts){
    const { token, remote, headers, ...opts } = gitOpts

    this.options = opts
    this.baseUrl = remote
    this.headers = BaseGitApi.buildHeaders(token, headers)
  }

  _callApi = async <T=TGitApiRes>(
    params:string|string[]|Partial<AxiosRequestConfig>,
    conf:TGitApiConf=emptyObj
  ) => {
    throwOverrideErr()
    return undefined
  }

  getRepo = async (repo:string):Promise<TRepoApiMeta> => {
    throwOverrideErr()
    return undefined
  }
  
  defaultBranch = async (repoName:string) => {
    throwOverrideErr()
    return undefined
  }

  getBranch = async (branch:string):Promise<false | void | TBranchMeta> => {
    throwOverrideErr()
    return undefined
  }

  createBranch = async (newBranch:string, { from, hash }:TGitCreateBranchCof):Promise<string> => {
    throwOverrideErr()
    return undefined
  }

  branchHash = async (branch:string):Promise<string | void> => {
    throwOverrideErr()
    return undefined
  }

}
