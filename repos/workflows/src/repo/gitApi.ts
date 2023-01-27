import type { AxiosRequestConfig } from 'axios'
import type {
  TGitOpts,
  TRepoResp,
  TBranchResp,
  TGitCreateRepoOpts,
} from '@gobletqa/workflows/types'

import axios, { AxiosError } from 'axios'
import { Logger } from '@keg-hub/cli-utils'
import { throwGitError, buildHeaders, buildAPIUrl } from './gitUtils'
import {
  isArr,
  isStr,
  limbo,
  emptyObj,
  deepMerge,
  ensureArr,
} from '@keg-hub/jsutils'

type TApiRes = {
  data: Record<any, any>
}

type TApiConf = {
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

export class GitApi {
  baseUrl:string
  headers:Record<string, string>
  options:Omit<TGitOpts, `token`|`remote`>
  _cache: Record<string, [AxiosError, Record<any, any>]>={}

  static error = (message:string, ...args:any[]) => {
    console.log(...args)
    throw new Error(message)
  }
  
  // TODO: Add ability to create a new repo from UI
  // Then add work flow to create the repo and setup the default user branch
  static createRepo = (args:TGitCreateRepoOpts, gitOpts:TGitOpts) => {

  // name: string
  // homepage?:string
  // private?:boolean
  // has_wiki?:boolean
  // has_issues?:boolean
  // description?: string
  // has_projects?:boolean
  // allow_squash_merge?:boolean
  // allow_merge_commit?:boolean
  // delete_branch_on_merge?:boolean
    
    const createParams = deepMerge(createOpts.override, args, createOpts.force)
    Logger.log(`Creating repo ${args.name} with params`, createParams)

  }
  
  constructor(gitOpts:TGitOpts){
    const { token, remote, ...opts } = gitOpts

    this.options = opts
    this.baseUrl = remote
    this.headers = buildHeaders(token)
  }

  _callApi = async <T=TApiRes>(
    params:string|string[]|Partial<AxiosRequestConfig>,
    conf:TApiConf=emptyObj
  ) => {

    const args = isStr(params) || isArr(params)
      ? { url: params }
      : params


    const url = buildAPIUrl(this.baseUrl, ensureArr(args.url))

    const { cache, error:throwErr } = conf

    if(cache !== false && this._cache[url]) return this._cache[url] as [AxiosError, T]

    const config = deepMerge<AxiosRequestConfig>({
      method: 'GET',
      headers: this.headers,
    }, params, { url })
    
    const [err, resp] = await limbo<T, AxiosError>(axios(config))
    const axiosRes = [err, resp] as [AxiosError, T]

    if(cache !== false) this._cache[url] = axiosRes as [AxiosError, T]

    if(resp || !err || !throwErr) return axiosRes as [AxiosError, T]
    
    const error = err?.response?.data as Error
    throwGitError(error, url)

    return axiosRes as [AxiosError, T]
  }

  getRepo = async (repo:string) => {
    // TODO: the repo name is already part of the base URL
    // If we ever need to get the repo meta for a different repo
    // Then we need to override the base url and build it with the passed in repo name
    // For now, just pass an empty string
    const [err, resp] = await this._callApi<TRepoResp>('')
    return resp.data
  }
  
  defaultBranch = async (repoName:string) => {
    Logger.log(`Getting repo ${repoName} default branch...`)
    const repo = await this.getRepo(repoName)

    return repo.default_branch
  }

  getBranch = async (branch:string) => {
    Logger.log(`Getting branch ${branch} meta data...`)
    const [err, resp] = await this._callApi<TBranchResp>(`branches/${branch}`, { error: false })

    if (resp?.data) return resp?.data

    const error = err?.response?.data as Error
    return err.code === AxiosError.ERR_BAD_REQUEST && err?.response?.status === 404
      ? false
      : throwGitError(error, `branches/${branch}`)
  }

  createBranch = async (newBranch:string, { from, hash }:TCreateBranchCof) => {
    const sha = hash || await this.branchHash(from)

    Logger.log(`Using branch sha ${sha} to create branch ${newBranch}...`)

    const [err, resp] = await this._callApi<any>({
      method: `POST`,
      url: `git/refs`,
      data: {
        sha,
        ref: `refs/heads/${newBranch}`,
      },
    } as AxiosRequestConfig)

    return newBranch
  }

  branchHash = async (branch:string) => {
    Logger.log(`Getting branch ${branch} sha...`)
    
    const [err, resp] = await this._callApi<any>([`git/refs`, `/heads/${branch}`])
    const sha = resp?.data?.object?.sha as string

    return sha || throwGitError(new Error(resp?.data))
  }

}
