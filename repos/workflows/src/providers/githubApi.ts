import type { AxiosRequestConfig } from 'axios'
import type {
  TGitOpts,
  TRepoResp,
  TBranchResp,
  TGitCreateRepoOpts,
} from '@gobletqa/workflows/types'

import url from 'url'
import path from 'path'
import axios, { AxiosError } from 'axios'
import { Logger } from '@keg-hub/cli-utils'
import { throwGitError } from '../utils/throwGitError'
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

export class GitHubApi {
  baseUrl:string
  headers:Record<string, string>
  options:Omit<TGitOpts, `token`|`remote`>
  _cache: Record<string, [AxiosError, Record<any, any>]>={}

  static error = (message:string, ...args:any[]) => {
    console.log(...args)
    throw new Error(message)
  }

/**
 * Create a new repo by making a post request to github's API
 * @example - User
 * curl -H "Authorization: token ACCESS_TOKEN" \
 *   --data '{"name":"NEW_REPO_NAME"}' \
 *   https://api.github.com/user/repos
 *
 * @example - Organization
 * curl -H "Authorization: token ACCESS_TOKEN" \
 * --data '{"name":"NEW_REPO_NAME", "description": "", "private": true, "auto_init": true }' \
 * https://api.github.com/orgs/ORGANIZATION_NAME/repos
 *
*/
  static createRepo = async (args:TGitCreateRepoOpts) => {
    const { url, token, ...params } = args

    const createParams = deepMerge(createOpts.override, params, createOpts.force)
    Logger.log(`Creating repo ${args.name} with params`, createParams)

    const config = deepMerge<AxiosRequestConfig>({
      url,
      method: `POST`,
      data: createParams,
      headers: GitHubApi.buildHeaders(token),
    })

    const [err, resp] = await limbo<TRepoResp, AxiosError>(axios(config))
    if(err){
      const error = err?.response?.data as Error
      throwGitError(error, url)
    }

    Logger.success(`Successfully created repo ${args.name}`)
    return resp?.data
  }

  static buildHeaders = (token:string) => ({
    ...(token && { Authorization: `token ${token}` }),
    [`Content-Type`]: `application/json`,
    Accept: `application/vnd.github+json`,
  })

  static buildAPIUrl = (remote:string, pathExt:string[]=[]) => {
    const repoUrl = new url.URL(remote)
    repoUrl.host = process.env.GITHUB_API_URL || `api.github.com`
    repoUrl.pathname = path.join(`repos`, repoUrl.pathname, ...pathExt)

    return repoUrl.toString()
  }

  /**
   * Dummy data for create a repo and not hitting the github api
   */
  // static _createRepo = async (args:TGitCreateRepoOpts) => {
  //   return {
  //     id: 594255619,
  //     private: true,
  //     name: 'test-repo',
  //     node_id: 'R_kgDOI2ufAw',
  //     default_branch: 'master',
  //     full_name: 'lancetipton/test-repo',
  //     html_url: 'https://github.com/lancetipton/test-repo',
  //   }
  // }

  constructor(gitOpts:TGitOpts){
    const { token, remote, ...opts } = gitOpts

    this.options = opts
    this.baseUrl = remote
    this.headers = GitHubApi.buildHeaders(token)
  }

  _callApi = async <T=TApiRes>(
    params:string|string[]|Partial<AxiosRequestConfig>,
    conf:TApiConf=emptyObj
  ) => {

    const args = isStr(params) || isArr(params)
      ? { url: params }
      : params


    const url = GitHubApi.buildAPIUrl(this.baseUrl, ensureArr(args.url))

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
    Logger.log(`Getting branch ${branch} meta-data...`)
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
