import type { AxiosRequestConfig } from 'axios'
import type { EProvider } from '@gobletqa/shared/enums'
import type { TGitCreateRepoOpts } from '@gobletqa/git'
import type { TRepoData, TBranchData } from './restapi.types'
import type { GitlabApi } from '@GWF/providers/gitlabApi'
import type { GithubApi } from '@GWF/providers/githubApi'

import { AxiosError } from 'axios'

export type TApiConf = {
  url?:string
  error?:boolean
  cache?:boolean
  params?:string|string[]|Partial<AxiosRequestConfig>,
}


export type TGitReqHeaders = Record<string, string>

export type TGitApiRes = {
  data: Record<any, any>
}

export type TGitApiConf = {
  url?:string
  error?:boolean
  cache?:boolean
}

export type StaticImplements<I extends new (...args: any[]) => any, C extends I> = InstanceType<I>

export type TBuildApiUrl = {
  host:string
  remote:string
  prePath?:string
  postPath?:string
  pathExt?:string[]
}

export interface IGitApi {
  baseUrl:string
  headers:TGitReqHeaders
  _cache: Record<string, [AxiosError, Record<any, any>]>
 
 _callApi:<T=TGitApiRes>(
    params:string|string[]|Partial<AxiosRequestConfig>,
    conf:TGitApiConf
  ) => Promise<[AxiosError|null, T|null]>

  branchHash: (branch:string) => Promise<string | void>
  getRepo: (repo:string) => Promise<TRepoData>
  defaultBranch: (repoName:string) => Promise<string>
  getBranch: (branch:string) => Promise<false | void | TBranchData>
  createBranch: (newBranch:string, conf:TBranchData) => Promise<string>
}

export interface IGitApiStatic {
  new (...args: any[]): IGitApi
  buildAPIUrl: (args:TBuildApiUrl, provider:EProvider) => string
  error:(message:string, ...args:any[]) => void
  createRepo:(args:TGitCreateRepoOpts) => Promise<TRepoData>
}

export type GitApi = GithubApi | GitlabApi
