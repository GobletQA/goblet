import type { AxiosRequestConfig } from 'axios'
import type {
  TGitOpts,
  TBranchMeta,
  TRepoApiMeta,
  TGitCreateRepoOpts,
} from '.'

import { AxiosError } from 'axios'

export type TApiConf = {
  url?:string
  error?:boolean
  cache?:boolean
  params?:string|string[]|Partial<AxiosRequestConfig>,
}

export type TCreateBranchCof = {
  hash?:string
  from?:string
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

export type TGitCreateBranchCof = {
  hash?:string
  from?:string
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
  getRepo: (repo:string) => Promise<TRepoApiMeta>
  defaultBranch: (repoName:string) => Promise<string>
  getBranch: (branch:string) => Promise<false | void | TBranchMeta>
  createBranch: (newBranch:string, { from, hash }:TGitCreateBranchCof) => Promise<string>
}

export interface IGitApiStatic {
  new (...args: any[]): IGitApi
  buildAPIUrl: (args:TBuildApiUrl) => string
  createRepo:(args:TGitCreateRepoOpts) => void
  error:(message:string, ...args:any[]) => void
}
