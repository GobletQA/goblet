import type { AxiosRequestConfig } from 'axios'
import type { TGitOpts, TGitCreateRepoOpts } from '@gobletqa/git'
import type {
  TApiConf,
  TRepoResp,
  TRepoData,
  TGitApiRes,
  TBranchData,
  TBranchResp,
  TGLRepoApiMeta,
  TGLBranchMeta,
} from '@GWF/types'


import { Rest } from '../constants'
import { Logger } from '@gobletqa/logger'
import axios, { AxiosError, } from 'axios'
import { BaseRestApi } from './baseRestApi'
import { isArr } from '@keg-hub/jsutils/isArr'
import { isStr } from '@keg-hub/jsutils/isStr'
import { limbo } from '@keg-hub/jsutils/limbo'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { ensureArr } from '@keg-hub/jsutils/ensureArr'

type TApiError = {
  error:string
  scope:string
  error_description: string
}

// curl --header "Authorization: Bearer <token>" "https://gitlab.com/api/v4/projects"
export class GitlabApi extends BaseRestApi {

  /**
   * @example - User
   * curl --request POST --header "PRIVATE-TOKEN: <your-token>" \
   * --header "Content-Type: application/json"
   * --data '{ "name": "new_project", "description": "New Project", "path": "new_project", "namespace_id": "42", "initialize_with_readme": "true"}' \
   * --url /projects/user/:user_id
   *
   * @example - Organization
   * curl --request POST --header "PRIVATE-TOKEN: <your-token>" \
   * --header "Content-Type: application/json"
   * --data '{ "name": "new_project", "description": "New Project", "path": "new_project", "namespace_id": "42", "initialize_with_readme": "true"}' \
   * --url 'https://gitlab.example.com/api/v4/projects/'
   */
  static createRepo = async (args:TGitCreateRepoOpts):Promise<TRepoData> => {
    return undefined
  }

  constructor(gitOpts:TGitOpts){
    super(gitOpts, Rest.Gitlab)
  }

  _callApi = async <T=TGitApiRes>(
    params:string|string[]|Partial<AxiosRequestConfig>,
    conf:TApiConf=emptyObj
  ) => {

    const args = isStr(params) || isArr(params)
      ? { url: params } as Partial<AxiosRequestConfig>
      : params as Partial<AxiosRequestConfig>

    const url = GitlabApi.buildAPIUrl({
      remote: this.baseUrl,
      host: Rest.Gitlab.Url,
      prePath: `api/v4/projects`,
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

    if(this.cacheEnabled && cache !== false && !err)
      this._cache[url] = axiosRes as [AxiosError, T]

    if(resp || !err || !throwErr) return axiosRes as [AxiosError, T]

    const error = err?.response?.data as TApiError
    const apiErr = new Error(`[${error.error}] - ${error.error_description} | (Scope: ${error.scope})`)

    this.throwError(apiErr, url)

    return axiosRes as [AxiosError, T]
  }

  getRepo = async (repoId:string):Promise<TRepoData> => {
    // this.baseUrl already includes the repoId, so we don't have to include it here
    const [err, resp] = await this._callApi<TRepoResp>(``, { error: true })
    const data = resp.data as TGLRepoApiMeta

    return {
      id: data.id,
      name: data.name,
      url: data.web_url,
      description: data.description,
      git_url: data.http_url_to_repo,
      default_branch: data.default_branch,
      full_name: data.path_with_namespace,
      private: data.visibility === `private`,
    }
  }
  
  defaultBranch = async (repoName:string) => {
    Logger.log(`Getting repo ${repoName} default branch...`)
    const repo = await this.getRepo(repoName)

    return repo.default_branch
  }

  getBranch = async (branch:string, conf?:TApiConf):Promise<false | void | TBranchData> => {
    const [err, resp] = await this._callApi<TBranchResp>(
      `repository/branches/${encodeURIComponent(branch)}`,
      conf
    )
   
    if (resp?.data){
      const data = resp.data as TGLBranchMeta
      return { name: data?.name, sha: data?.commit.id }
    }

    const error = err?.response?.data as Error
    return err.code === AxiosError.ERR_BAD_REQUEST && err?.response?.status === 404
      ? false
      : this.throwError(error, `branches/${branch}`)
  }

  /**
    * curl --request POST --header "PRIVATE-TOKEN: <your_access_token>" "https://gitlab.com/api/v4/projects/5/repository/branches?branch=newbranch&ref=main"
   */
  createBranch = async (newBranch:string, { name:from, sha:hash }:TBranchData):Promise<string> => {
    Logger.log(`Using branch ${from} to create branch ${newBranch}...`)

    const [err, resp] = await this._callApi<any>({
      method: `POST`,
      url: `repository/branches`,
      data: { branch: newBranch, ref: from },
    } as AxiosRequestConfig)

    Logger.success(`Repo branch ${newBranch} created successfully.`)

    return err ? undefined : newBranch
  }

  branchHash = async (branch:string):Promise<string | void> => {
    const meta = await this.getBranch(branch, { error: true })
    return meta ? meta?.sha : undefined
  }

}
