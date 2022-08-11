import axios from 'axios'
import { GRAPH } from '../constants/graph'

import {
  get,
  isArr,
  isStr,
  isNum,
  limbo,
  noOpObj,
  noPropArr,
  deepClone,
  deepMerge,
} from "@keg-hub/jsutils"
import {
  TGCacheOpts,
  TGraphApiVars,
  TGraphApiResp,
  TGraphPageInfo
} from '@gobletqa/workflows/types'

const defOpts:TGCacheOpts = noOpObj as TGCacheOpts
const defVarOpts:TGraphApiVars = noOpObj as TGraphApiVars
const defPageInfo:TGraphPageInfo = noOpObj as TGraphPageInfo

/**
 * Class to with methods for accessing the graphQL cached variables
 * Allows for paging by caching past requests via this.variables object
 * @type Class
 */
export class GraphCache {

  /**
   * Holds the default variables for making requests to github API
   * @type {Object}
   */
  #defaultVars = {
    [GRAPH.ENDPOINTS.REPO.LIST_ALL.KEY]: {
      first: 50,
      after: null,
      affiliations: GRAPH.OPTS.AFFILIATIONS,
      ownerAffiliations: GRAPH.OPTS.AFFILIATIONS,
      sortDirection: GRAPH.OPTS.SORT_DIRECTION.ASC,
    }
  }

  #token = ``
  url = `https://api.github.com/graphql`
  variables:Record<any, any>

  constructor(opts:TGCacheOpts=defOpts){
    this.variables = deepClone(this.#defaultVars)
    if(opts.url) this.url = opts.url
    
    this.#token = opts.token
  }

  /**
   * Access current graphQL cache for a request
   * @param {string} request - Name of the request
   * 
   * @returns {Object|undefined} - The cached data object if it exists
   */
  get = (request:string) => {
    return this.variables[request] || noOpObj
  }

  /**
   * Set the graphQL cache for a request
   * @param {string} request - Name of the request
   * @param {Object} data - Cache data to set for the request
   * 
   * @returns {Void}
   */
  set = (request:string, data:Record<any, any>) => {
    this.variables[request] = deepMerge(this.variables[request], data)
  }

  /**
   * Resets the graphQL cache of a request to it's original state
   * @param {string} request - Name of the request
   * 
   * @returns {Void}
   */
  reset = (request:string) => {
    this.variables[request] &&
      (this.variables[request] = deepClone(this.#defaultVars[request]))
  }

  buildHeaders = (headers:Record<any, any>) => {
    return deepMerge({
      "content-type": "application/json",
      authorization: `token ${this.#token}`
    }, headers)
  }



  /**
   * Builds the variables for making a Github GraphQL request
   * @param {Object} opts - Data to override the cached variables
   * @param {string} request - Name of the request
   * 
   * @returns {Object} - Variables to be used in a GraphQL Request
   */
  buildVars = (opts:TGraphApiVars=defVarOpts, request:string) => {
    return {
      ...this.get(request),
      ...Object.entries(opts)
        .reduce((acc, [key, data]) => {
          switch(key){
            case 'first':
              isNum(data) && (acc[key] = data)
            break
            case 'after':
              isStr(data) && (acc[key] = data)
            break
            case 'sortDirection': 
              isStr(data) && 
                (data === 'ASC' || data === 'DES') &&
                (acc[key] = data)
              break
            case 'ownerAffiliations':
            case 'affiliations':
              isArr(data) && (acc[key] = data)
            break
          }
          return acc
        }, {}),
    }
  }
}



/**
 * Calls Github's GraphQL API endpoint to get a list of a users repos
 * @param {string} query - GraphQL query string
 * @param {Object} endpoint - Contains cache key and path to the data in the response obj
 * @param {string} token - Github Auth Token for authentication
 * @param {boolean} all - Use paging to get all items from the endpoint via multiple calls
 * @param {number} first - Starting item when paging through multiple API call results
 * @param {string} after - Used when paging through multiple API call results
 * @param {Array} [ownerAffiliations] - Github defined array of affiliations
 * @param {Array} [affiliations] - Github defined array of affiliations
 * @param {Object} headers - Extra headers to add the API call
 */
const graphApiCall = async (args:TGraphApiVars) => {
  const { headers:customHeaders, endpoint } = args
  const {
    QUERY: query,
    KEY:endpointKey,
    DATA_PATH:dataPath,
  } = endpoint

  const graphCache = args.graphCache || new GraphCache(args)
  const headers = graphCache.buildHeaders(customHeaders)
  const variables = graphCache.buildVars(args, endpointKey)

  const [ err, resp ] = await limbo(axios({
    headers,
    method: 'post',
    url: graphCache.url,
    data: {
      query,
      variables,
    },
  }))

  if(err) throw new Error(err.stack)

  const { errors, data } = resp.data

  if(errors && errors.length)
    throw new Error(errors[0].message || `Could not complete github.listRepos API call. Please try again later`)

  const { nodes=noPropArr, pageInfo=defPageInfo } = get(data, dataPath, noOpObj) as TGraphApiResp

  if(pageInfo.hasNextPage && pageInfo.endCursor){
    graphCache.set(endpointKey, { after: pageInfo.endCursor })
    const moreNodes = await graphApiCall({
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
 * getUserRepos({
 *   token: '12345',
 *   all: true,
 *   first: 100,
 *   after: '',
 *   ownerAffiliations: [],
 *   affiliations: []
 *   headers: {},
 * })
 *
 * @returns {*} - Query Response
*/
export const getUserRepos = async opts => {
  return await graphApiCall({
    ...opts,
    endpoint: GRAPH.ENDPOINTS.REPO.LIST_ALL,
  })
}

export const getRepoBranches = async opts => {
  console.warn(`Not implemented`)
  return []
  // return await graphApiCall({
  //   ...opts,
  //   endpoint: GRAPH.ENDPOINTS.REPO.BRANCHES,
  // })
}

