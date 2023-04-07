import type { AxiosRequestConfig } from 'axios'
import type {
  TGitOpts,
  TGitApiRes,
  TGitApiConf,
  TBranchMeta,
  TRepoApiMeta,
  TBuildApiUrl,
  TGitReqHeaders,
  TGitCreateRepoOpts,
  TGitCreateBranchCof,
} from '@gobletqa/workflows/types'

import { Rest } from '../constants'
import { emptyObj } from '@keg-hub/jsutils'
import { BaseRestApi } from './baseRestApi'

// curl --header "Authorization: Bearer <token>" "https://gitlab.com/api/v4/projects"
export class GitlabApi extends BaseRestApi {

  static host:string = Rest.Gitlab.Url
  static globalHeaders:Record<string, string> = {
  }

  static buildAPIUrl = (args:TBuildApiUrl) => {
    return super.buildAPIUrl({...args, host: args.host || this.host})
  }

  static buildHeaders = (token:string, headers:TGitReqHeaders=emptyObj as TGitReqHeaders) => {
    return super.buildHeaders(token, {
      ...this.globalHeaders,
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    })
  }


  static createRepo = async (args:TGitCreateRepoOpts):Promise<TRepoApiMeta> => {
    return undefined
  }

  constructor(gitOpts:TGitOpts){
    super(gitOpts)
  }

  _callApi = async <T=TGitApiRes>(
    params:string|string[]|Partial<AxiosRequestConfig>,
    conf:TGitApiConf=emptyObj
  ) => {
    return undefined
  }

  getRepo = async (repo:string):Promise<TRepoApiMeta> => {
    return undefined
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
