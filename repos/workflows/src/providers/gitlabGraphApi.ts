import type { TRepoGraphRepos } from '@GWF/types/shared.types'
import type {
  TRepoMeta,
  TGraphApiOpts,
} from '@GWF/types'

import { Graph } from '../constants/graph'
import { get } from '@keg-hub/jsutils/get'
import { BaseGraphApi } from './baseGraphApi'
import { isObj } from '@keg-hub/jsutils/isObj'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'


type TUserRepoResp = {
  name: string
  fullPath: string
  httpUrlToRepo: string
  repository: { rootRef: string }
}

export class GitlabGraphApi extends BaseGraphApi {

  /**
   * Holds the default variables for making requests to gitlab API
   * @type {Object}
   */
  static defaultVars = {
    [Graph.Gitlab.Endpoints.Repo.ListAll.Key]: {
      first: 100,
      after: null,
    },
    [Graph.Gitlab.Endpoints.Repo.Branches.Key]: {
      offset: 0,
      first: 100,
      after: null,
      searchPattern: `*`,
    }
  }

  constructor(opts?:TGraphApiOpts){
    super({
      provider: Graph.Gitlab,
      variables: GitlabGraphApi.defaultVars,
      ...opts
    })
  }

  repoBranches = async (opts:TRepoGraphRepos) => {
    const endpoint = this.provider.Endpoints.Repo.Branches
    return this.callApi<string>({
      ...opts,
      endpoint,
      getData: <T>(data:any) => {
        const branches = get(data, endpoint.DataPath, emptyArr) as T[]
        return {
          nodes: branches,
          totalCount: branches.length
        }
      }
    })
  }

  /**
  * Gets all repos relative to the passed in token for a user
  * @param {Object} opts - Options for making the query
  * @example
  * graphApi.userRepos({
  *   token: '12345',
  *   first: 100,
  *   after: '',
  *   offset: 0,
  *   headers: {},
  * })
  *
  */
  userRepos = async (opts:TRepoGraphRepos):Promise<TRepoMeta[]> => {
    const repos = await this.repos<TUserRepoResp>(opts)
    const filtered = repos.filter(repo => isObj(repo))

    return filtered.reduce(async (resolve, repo) => {
      const acc = await resolve as TRepoMeta[]

      const {
        name,
        fullPath,
        repository,
        httpUrlToRepo:url,
      } = repo
      
      // Branches don't come with the response
      // So we have to make a separate call to get them
      const branches = await this.repoBranches({
        ...opts,
        fullPath,
      })

      acc.push({
        url,
        name,
        id: fullPath,
        defaultBranch: repository.rootRef,
        branches: branches?.length ? branches : [repository.rootRef]
      } as TRepoMeta)

      return acc
    }, Promise.resolve([]))
  }

}
