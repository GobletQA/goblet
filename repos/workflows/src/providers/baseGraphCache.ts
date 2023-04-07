import type {
  TGCacheOpts,
  TGraphApiVars,
} from '@gobletqa/workflows/types'

import {
  isArr,
  isStr,
  isNum,
  emptyObj,
  deepClone,
  deepMerge,
} from '@keg-hub/jsutils'


const defOpts:TGCacheOpts = emptyObj as TGCacheOpts
const defVarOpts:TGraphApiVars = emptyObj as TGraphApiVars

/**
 * Class to with methods for accessing the graphQL cached variables
 * Allows for paging by caching past requests via this.variables object
 * @type Class
 */
export class BaseGraphCache {

  variables:Record<any, any> = {}
  #defaultVars:Record<any, any> = {}

  constructor(opts:TGCacheOpts=defOpts){
    this.#defaultVars = deepMerge(this.#defaultVars, opts.variables)
    this.variables = deepClone(this.#defaultVars)
  }

  /**
   * Access current graphQL cache for a request
   * @param {string} request - Name of the request
   * 
   * @returns {Object|undefined} - The cached data object if it exists
   */
  get = (request:string) => {
    return this.variables[request] || emptyObj
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
            case `first`:
              isNum(data) && (acc[key] = data)
            break
            case `after`:
              isStr(data) && (acc[key] = data)
            break
            case `fullPath`:
              isStr(data) && (acc[key] = data)
            break
            case `username`:
              isStr(data) && (acc[key] = data)
            break
            case `offset`: 
              isNum(data) && (acc[key] = data)
            break
            case `searchPattern`:
              isStr(data) && (acc[key] = data)
            break
            case `affiliations`:
            case `ownerAffiliations`:
              isArr(data) && (acc[key] = data)
            break
            case `sortDirection`: 
              isStr(data) && 
                (data === 'ASC' || data === 'DES') &&
                (acc[key] = data)
            break
          }
          return acc
        }, {}),
    }
  }

}

