import type {
  TRepoMeta,
  TGraphApiOpts,
  TGHRepoApiMeta,
} from '@gobletqa/workflows/types'
import type { TRepoGraphRepos } from '@gobletqa/workflows/types/shared.types'

import { Rest } from '../constants/rest'
import { Graph } from '../constants/graph'
import { BaseGraphApi } from './baseGraphApi'
import { isObj } from '@keg-hub/jsutils/isObj'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { noPropArr } from '@keg-hub/jsutils/noPropArr'


type TReposResp = {
  data: TGHRepoApiMeta[] & { errors?: any[] }
}

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
   * Not currently used, was testing as a workaround for missing github organization repos
   * But it's related to the Github token, not the Github API endpoint
   * Curl Example: curl -s -H "Authorization: token 1234" "https://api.github.com/user/repos?affiliation=organization_member&sort=updated"
   */
  memberRepos = async (args:TRepoGraphRepos, uRepos:TUserRepoResp[]) => {
    const { token, headers } = args

    const [err, resp] = await this.request<TReposResp>({
      method: `get`,
      url: `https://${Rest.Github.Url}/user/repos`,
      headers: this.buildHeaders(token, {
        ...Rest.Github.Headers,
        ...headers
      }),
      params: {
        sort: `updated`,
        affiliation: `organization_member`
      },
    })
    
    this.apiError(err, resp?.data?.errors)
    const repos = resp?.data.map(item => {
      return {
        id: item.id,
        name: item.name,
        url: item.html_url,
        refs: { nodes: [{ name: item.default_branch }] },
      }
    })

    const missing = []
    repos.forEach(repo => {
      const found = uRepos.find(uR => uR.url === repo.url)
      !found && missing.push(repo)
    })
    
    if(!missing.length) return repos

    // TODO: get all branches for repos in missing array
    return [...uRepos, ...repos]

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

