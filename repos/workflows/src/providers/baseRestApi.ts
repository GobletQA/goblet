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
import { Rest } from '../constants'
import axios, { AxiosError, } from 'axios'
import { buildHeaders } from '../utils/buildHeaders'
import { throwGitError } from '../utils/throwGitError'
import {
  isArr,
  isStr,
  limbo,
  emptyArr,
  emptyObj,
  deepMerge,
  ensureArr,
} from '@keg-hub/jsutils'

type Provider = typeof Rest[`Github`] | typeof Rest[`Gitlab`]

const throwOverrideErr = (message?:string) => {
  throw new Error(message || `Git Provider method must be overridden by an extending Class`)
}

export class BaseRestApi implements StaticImplements<IGitApiStatic, typeof BaseRestApi> {
  baseUrl:string
  headers:Record<string, string>
  _cache: Record<string, [AxiosError, Record<any, any>]>={}


  /**
   * Logs a Git Provider API error message
   */
  static error = (message:string, ...args:any[]) => {
    console.log(...args)
    throw new Error(message)
  }

  static throwError = (
    err:Error,
    remoteUrl:string=`Unknown`,
    message:string=`[WRK-FL Git API] Error calling Git API`
  ) => throwGitError(err, remoteUrl, message)


  static createRepo = async (args:TGitCreateRepoOpts):Promise<TRepoApiMeta> => {
    throwOverrideErr()
    return undefined
  }

  static buildAPIUrl = (args:TBuildApiUrl) => {
    const {
      host,
      remote,
      prePath=``,
      postPath=``,
      pathExt=emptyArr,
    } = args

    const repoUrl = new url.URL(remote)
    repoUrl.host = host
    repoUrl.pathname = path.join(prePath, repoUrl.pathname, postPath, ...pathExt)

    return repoUrl.toString()
  }

  constructor(gitOpts:TGitOpts, provider:Provider){
    const { token, remote, headers, ...opts } = gitOpts
    this.baseUrl = remote
    this.headers = buildHeaders({
      token,
      headers,
      provider
    })
  }

  throwError = BaseRestApi.throwError
  buildAPIUrl = BaseRestApi.buildAPIUrl

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
