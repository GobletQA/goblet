import type {
  TRepoMeta,
  TGraphApiOpts,
  TGraphApiResp,
} from '@gobletqa/workflows/types'
import type { TRepoGraphRepos } from '@gobletqa/workflows/types/shared.types'

import { Graph } from '../constants/graph'
import { BaseGraphApi } from './baseGraphApi'
import {
  isObj,
  emptyObj,
  noPropArr,
} from '@keg-hub/jsutils'


type TUserRepoResp = {
  url:string
  name:string
  refs: Record<`nodes`, Record<`name`, string>[]>
}

export class GithubGraphApi extends BaseGraphApi {

  /**
   * Holds the default variables for making requests to github API
   * @type {Object}
   */
  static defaultVars = {
    [Graph.Github.Endpoints.Repo.ListAll.Key]: {
      first: 50,
      after: null,
      affiliations: Graph.Github.Opts.Affiliations,
      ownerAffiliations: Graph.Github.Opts.Affiliations,
      sortDirection: Graph.Github.Opts.SortDirection.ASC,
    }
  }

  constructor(opts:TGraphApiOpts=emptyObj){
    super({
      provider: Graph.Github,
      variables: GithubGraphApi.defaultVars,
      ...opts
    })
  }

  /**
  * Gets all repos relative to the passed in token for a user
  * @param {Object} opts - Options for making the query
  * @example
  * graphApi.userRepos({
  *   token: '12345',
  *   all: true,
  *   first: 100,
  *   after: '',
  *   ownerAffiliations: [],
  *   affiliations: []
  *   headers: {},
  * })
  *
  */
  userRepos = async (opts:TRepoGraphRepos):Promise<TRepoMeta[]> => {
    const repos = await this.repos<TUserRepoResp>(opts)

    return repos.filter(repo => isObj(repo))
      .map(repo => {
        const { refs, url, name } = repo
        return !refs || !refs.nodes || !refs.nodes.length
          ? {url, name, id:url, branches: noPropArr}
          : {
              url,
              name,
              id:url,
              branches: refs.nodes.map(branch => branch.name).filter(name => name)
            } as TRepoMeta
      })
  }

}

