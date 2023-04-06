import type { AxiosRequestConfig } from 'axios'
import type {
  TGitOpts,
  TRepoResp,
  TBranchResp,
  TBranchMeta,
  TRepoApiMeta,
  TGitCreateRepoOpts,
} from '@gobletqa/workflows/types'

import url from 'url'
import path from 'path'
import { AxiosError } from 'axios'
import { emptyObj } from '@keg-hub/jsutils'

type TApiRes = {
  data: Record<any, any>
}

type TApiConf = {
  url?:string
  error?:boolean
  cache?:boolean
}

type TCreateBranchCof = {
  hash?:string
  from?:string
}

const createOpts = {
  override: {
    private: true,
    has_wiki: true,
    has_issues: true,
    has_projects: true,
    allow_merge_commit: false,
    delete_branch_on_merge: false,
  },
  force: {
    auto_init: true,
  },
}

type StaticImplements<I extends new (...args: any[]) => any, C extends I> = InstanceType<I>

interface IGitApi {
  baseUrl:string
  headers:Record<string, string>
  options:Omit<TGitOpts, `token`|`remote`>
  _cache: Record<string, [AxiosError, Record<any, any>]>
 
 _callApi:<T=TApiRes>(
    params:string|string[]|Partial<AxiosRequestConfig>,
    conf:TApiConf
  ) => Promise<[AxiosError|null, T|null]>

  branchHash: (branch:string) => Promise<string>
  getRepo: (repo:string) => Promise<TRepoApiMeta>
  defaultBranch: (repoName:string) => Promise<string>
  getBranch: (branch:string) => Promise<TBranchMeta>
  createBranch: (newBranch:string, { from, hash }:TCreateBranchCof) => Promise<string>
}

interface IGitApiStatic {
  new (...args: any[]): IGitApi
  createRepo:(args:TGitCreateRepoOpts) => void
  error:(message:string, ...args:any[]) => void
  buildHeaders:(token:string) => Record<string, string>
  buildAPIUrl: (remote:string, pathExt:string[], host?:string) => string
}

export class BaseGitApi implements StaticImplements<IGitApiStatic, typeof BaseGitApi> {
  baseUrl:string
  headers:Record<string, string>
  options:Omit<TGitOpts, `token`|`remote`>
  _cache: Record<string, [AxiosError, Record<any, any>]>={}

  static error = (message:string, ...args:any[]) => {
    console.log(...args)
    throw new Error(message)
  }

  static createRepo = async (args:TGitCreateRepoOpts) => {

  }

  static buildHeaders = (token:string) => {
    return {
      [`Content-Type`]: `application/json`,
      ...(token && { Authorization: `token ${token}` }),
    }
  }

  static buildAPIUrl = (remote:string, pathExt:string[]=[], host?:string) => {
    const repoUrl = new url.URL(remote)
    repoUrl.host = host
    repoUrl.pathname = path.join(`repos`, repoUrl.pathname, ...pathExt)

    return repoUrl.toString()
  }

  constructor(gitOpts:TGitOpts){
    const { token, remote, ...opts } = gitOpts

    this.options = opts
    this.baseUrl = remote
    this.headers = BaseGitApi.buildHeaders(token)
  }

  _callApi = async <T=TApiRes>(
    params:string|string[]|Partial<AxiosRequestConfig>,
    conf:TApiConf=emptyObj
  ) => {
    return [null, null] as any
  }

  getRepo = async (repo:string) => {
    return {} as TRepoApiMeta
  }
  
  defaultBranch = async (repoName:string) => {
    return ``
  }

  getBranch = async (branch:string) => {
    return {} as TBranchMeta
  }

  createBranch = async (newBranch:string, { from, hash }:TCreateBranchCof) => {
    return ``
  }

  branchHash = async (branch:string) => {
    return ``
  }

}
