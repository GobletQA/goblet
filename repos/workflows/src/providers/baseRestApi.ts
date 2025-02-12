import type { TGitOpts } from '@gobletqa/git'
import type { AxiosRequestConfig } from 'axios'
import type { TGitCreateRepoOpts } from '@gobletqa/git'
import type {
  TRepoData,
  TGitApiRes,
  TGitApiConf,
  TBranchData,
  TBuildApiUrl,
  IGitApiStatic,
  StaticImplements,
} from '@GWF/types'

import url from 'url'
import path from 'path'
import { Rest } from '../constants'
import { AxiosError, } from 'axios'
import { gitBaseUrl } from '../utils/gitBaseUrl'
import { EProvider } from '@gobletqa/shared/enums'
import { buildHeaders } from '../utils/buildHeaders'
import { throwGitError } from '../utils/throwGitError'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'


type Provider = typeof Rest[`Github`] | typeof Rest[`Gitlab`]

const throwOverrideErr = (message?:string) => {
  throw new Error(message || `Git Provider method must be overridden by an extending Class`)
}

export class BaseRestApi implements StaticImplements<IGitApiStatic, typeof BaseRestApi> {

  // This is the URL of the active repo, Which is NOT the same as the Provider URL (url)
  // The Provider URL (url) is used for making API calls
  // It is generated from the baseUrl in the buildAPIUrl method
  baseUrl:string

  cacheEnabled:boolean=false
  headers:Record<string, string>
  _cache: Record<string, [AxiosError, Record<any, any>]>={}


  /**
   * Logs a Git Provider API error message
   */
  static error = (message:string, ...args:any[]) => {
    args.length && console.error(...args)
    throw new Error(message)
  }

  static throwError = (
    err:Error,
    remoteUrl:string=`Unknown`,
    message:string=`[WRK-FL Git API] Error calling Git API`
  ) => throwGitError(err, remoteUrl, message)

  static createRepo = async (args:TGitCreateRepoOpts):Promise<TRepoData> => {
    throwOverrideErr()
    return undefined
  }

  static buildAPIUrl = (args:TBuildApiUrl, provider:EProvider) => {
    const {
      host,
      remote,
      prePath=``,
      postPath=``,
      pathExt=emptyArr,
    } = args


    const repoUrl = new url.URL(remote)

    repoUrl.host = host
      || (provider === EProvider.Github ? Rest.Github.Url : Rest.Gitlab.Url)

    repoUrl.pathname = path.join(prePath, repoUrl.pathname, postPath, ...pathExt)

    return repoUrl.toString()
  }

  constructor(gitOpts:TGitOpts, provider:Provider){
    const { token, remote, headers, ...opts } = gitOpts
    this.baseUrl = gitBaseUrl(remote)
    this.headers = buildHeaders({
      token,
      headers,
      provider
    })
  }

  throwError = (
    error:Error|AxiosError,
    url:string=this.baseUrl,
    message?:string
  ) => BaseRestApi.throwError(error, url, message)

  error = BaseRestApi.error
  buildAPIUrl = BaseRestApi.buildAPIUrl

  _callApi = async <T=TGitApiRes>(
    params:string|string[]|Partial<AxiosRequestConfig>,
    conf:TGitApiConf=emptyObj
  ) => {
    throwOverrideErr()
    return undefined
  }

  getRepo = async (repo:string):Promise<TRepoData> => {
    throwOverrideErr()
    return undefined
  }
  
  defaultBranch = async (repoName:string) => {
    throwOverrideErr()
    return undefined
  }

  getBranch = async (branch:string):Promise<false | void | TBranchData> => {
    throwOverrideErr()
    return undefined
  }

  createBranch = async (newBranch:string, data:TBranchData):Promise<string> => {
    throwOverrideErr()
    return undefined
  }

  branchHash = async (branch:string):Promise<string | void> => {
    throwOverrideErr()
    return undefined
  }

}
