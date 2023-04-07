import type { TRepoUserRepos } from '@gobletqa/workflows/types/shared.types'

import axios from 'axios'
import { Graph } from '../constants/graph'

import {
  get,
  limbo,
  isObj,
  noOpObj,
  noPropArr,
} from '@keg-hub/jsutils'
import type {
  TRepoMeta,
  TGraphApiVars,
  TGraphApiResp,
  TGraphPageInfo,
} from '@gobletqa/workflows/types'

const defPageInfo:TGraphPageInfo = noOpObj as TGraphPageInfo

export class GitlabGraphApi {

  /**
   * Calls Github's GraphQL API endpoint to get a list of a users repos
   */
  _callApi = async (args:TGraphApiVars) => {
    const { headers:customHeaders, endpoint } = args
    const {
      QUERY: query,
      KEY:endpointKey,
      DATA_PATH:dataPath,
    } = endpoint

    const graphCache = args.graphCache
    const headers = graphCache.buildHeaders(customHeaders)
    const variables = graphCache.buildVars(args, endpointKey)

    const opts = {
      headers,
      method: 'post',
      url: graphCache.url,
      data: {
        query,
        variables,
      },
    }

    const [ err, resp ] = await limbo(axios(opts))

    if(err) throw new Error(err.stack)

    const { errors, data } = resp.data

    if(errors && errors.length)
      throw new Error(errors[0].message || `Could not complete github.listRepos API call. Please try again later`)

    const { totalCount, nodes=noPropArr, pageInfo=defPageInfo } = get(data, dataPath, noOpObj) as TGraphApiResp

    if(pageInfo.hasNextPage && pageInfo.endCursor){
      graphCache.set(endpointKey, { after: pageInfo.endCursor })
      const moreNodes = await this._callApi({
        ...args,
        graphCache
      })

      return nodes.concat(moreNodes)
    }

    graphCache.reset(endpointKey)
    return nodes
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
  userRepos = async (opts:TRepoUserRepos):Promise<TRepoMeta[]> => {
    const repos = await this._callApi({
      ...opts,
      endpoint: Graph.gitlab.Endpoints.Repo.LIST_ALL,
    })

    return repos.filter(repo => isObj(repo))
      .map(repo => {
        const { refs, url, name } = repo
        return !refs || !refs.nodes || !refs.nodes.length
          ? {url, name, branches: noPropArr}
          : {
              url,
              name,
              branches: refs.nodes.map(branch => branch.name).filter(name => name)
            }
      })
  }

}
