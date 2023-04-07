import { GRAPH } from '../constants/graph'

import {
  isArr,
  isStr,
  isNum,
  noOpObj,
  deepClone,
  deepMerge,
} from '@keg-hub/jsutils'
import type {
  TGCacheOpts,
  TGraphApiVars,
} from '@gobletqa/workflows/types'


const defOpts:TGCacheOpts = noOpObj as TGCacheOpts
const defVarOpts:TGraphApiVars = noOpObj as TGraphApiVars

/**
 * Class to with methods for accessing the graphQL cached variables
 * Allows for paging by caching past requests via this.variables object
 * @type Class
 */
export class GithubGraphCache {

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

