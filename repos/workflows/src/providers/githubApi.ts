import type { TGitOpts } from '@gobletqa/git'
import type { AxiosRequestConfig } from 'axios'
import type { TGitCreateRepoOpts } from '@gobletqa/git'
import type {
  TApiConf,
  TRepoData,
  TRepoResp,
  TGitApiRes,
  TBranchData,
  TBranchResp,
  TBuildApiUrl,
  TGHBranchMeta,
} from '@GWF/types'

import { Rest } from '../constants'
import axios, { AxiosError, } from 'axios'
import { Logger } from '@gobletqa/logger'
import { BaseRestApi } from './baseRestApi'
import { isArr } from '@keg-hub/jsutils/isArr'
import { isStr } from '@keg-hub/jsutils/isStr'
import { limbo } from '@keg-hub/jsutils/limbo'
import { EProvider } from '@gobletqa/shared/enums'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { buildHeaders } from '../utils/buildHeaders'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { ensureArr } from '@keg-hub/jsutils/ensureArr'


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

export class GithubApi extends BaseRestApi {

  options:Omit<TGitOpts, `token`|`remote`>

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
    Logger.log(`Creating repo ${args.name} with params`, {...createParams, url})

    const config = deepMerge<AxiosRequestConfig>({
      url,
      method: `POST`,
      data: createParams,
      headers: buildHeaders({
        token,
        provider: Rest.Github
      }),
    })

    const [err, resp] = await limbo<TRepoResp, AxiosError>(axios(config))
    if(err){
      const error = err?.response?.data as Error
      this.throwError(error, url)
    }

    Logger.success(`Successfully created repo ${args.name}`)
    return resp?.data as TRepoData
  }

  static buildAPIUrl = (args:TBuildApiUrl) => {
    return BaseRestApi.buildAPIUrl(args, EProvider.Github)
  }

  constructor(gitOpts:TGitOpts){
    super(gitOpts, Rest.Github)
  }

  _callApi = async <T=TGitApiRes>(
    params:string|string[]|Partial<AxiosRequestConfig>,
    conf:TApiConf=emptyObj
  ) => {

    const args = isStr(params) || isArr(params)
      ? { url: params } as Partial<AxiosRequestConfig>
      : params as Partial<AxiosRequestConfig>


    const url = GithubApi.buildAPIUrl({
      prePath: `repos`,
      remote: this.baseUrl,
      host: Rest.Github.Url,
      pathExt: ensureArr(args.url)
    })

    const { cache, error:throwErr } = conf
    

    if(this.cacheEnabled && cache !== false && this._cache[url])
      return this._cache[url] as [AxiosError, T]

    const config = deepMerge<AxiosRequestConfig>({
      method: 'GET',
      headers: this.headers,
    }, args, { url })
    
    const [err, resp] = await limbo<T, AxiosError>(axios(config))
    const axiosRes = [err, resp] as [AxiosError, T]

    if(this.cacheEnabled && cache !== false)
      this._cache[url] = axiosRes as [AxiosError, T]

    if(resp || !err || !throwErr) return axiosRes as [AxiosError, T]
    
    const error = err?.response?.data as any
    this.throwError(new Error(`${error}`), url)

    return axiosRes as [AxiosError, T]
  }

  getRepo = async (repo:string) => {
    // The repo name is not passed because it already exists in this.baseUrl
    // So it's not needed here
    const [err, resp] = await this._callApi<TRepoResp>(``)

    if(err){
      const error = err?.response?.data as Error
      this.throwError(error, this.baseUrl, err?.message || `${err}`)
    }

    return resp?.data as TRepoData
  }

  defaultBranch = async (repoName:string) => {
    Logger.log(`Getting repo ${repoName} default branch...`)
    const repo = await this.getRepo(repoName)
    if(!repo) this.throwError(new Error(`Could not get default branch for repo`), this.baseUrl)

    return repo?.default_branch
  }

  getBranch = async (branch:string) => {
    Logger.log(`Getting branch ${branch} meta-data...`)
    const [err, resp] = await this._callApi<TBranchResp>(`branches/${branch}`, { error: false })

    if (resp?.data){
      const data = resp.data as TGHBranchMeta
      return { name: data?.name, sha: data?.commit.sha }
    }

    const error = err?.response?.data as Error
    return err.code === AxiosError.ERR_BAD_REQUEST && err?.response?.status === 404
      ? false
      : this.throwError(error, `branches/${branch}`)
  }

  createBranch = async (newBranch:string, { name:from, sha:hash }:TBranchData) => {
    const sha = hash || await this.branchHash(from)

    Logger.log(`Using branch sha ${sha} to create branch ${newBranch}...`)

    const [err, resp] = await this._callApi<any>({
      method: `POST`,
      url: `git/refs`,
      data: {
        sha,
        ref: `refs/heads/${newBranch}`,
      },
    } as AxiosRequestConfig, { error: true })

    return newBranch
  }

  branchHash = async (branch:string) => {
    Logger.log(`Getting branch ${branch} sha...`)
    
    const [err, resp] = await this._callApi<any>([`git/refs`, `/heads/${branch}`])
    const sha = resp?.data?.object?.sha as string

    return sha || this.throwError(new Error(resp?.data))
  }

  getOrgRepos = async () => {
    // curl -s -H "Authorization: token <token>" 'https://api.github.com/user/repos?affiliation=organization_member&sort=updated'
  }

}
