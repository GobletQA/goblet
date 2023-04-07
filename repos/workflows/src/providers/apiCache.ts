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

/**
 * Only use this is testing
 */
import { projects, branches } from '../../__mocks__/gitlab'

const defOpts:TGCacheOpts = emptyObj as TGCacheOpts
const defVarOpts:TGraphApiVars = emptyObj as TGraphApiVars

/**
 * Class to with methods for accessing the graphQL cached variables
 * Allows for paging by caching past requests via this.variables object
 * @type Class
 */
export class ApiCache {

  variables:Record<any, any> = {}
  #responses: Record<any, any> = {}
  #defaultVars:Record<any, any> = {}

  static instance:ApiCache
  static getInstance = (opts:TGCacheOpts=defOpts) => {
    if(this.instance){
      this.instance.#defaultVars = {
        ...this.instance.#defaultVars,
        ...opts.variables
      }

      this.instance.variables = deepClone(this.instance.#defaultVars)
    }
    else this.instance = new ApiCache(opts)

    return this.instance
  }

  constructor(opts:TGCacheOpts=defOpts){
    this.#defaultVars = deepMerge(this.#defaultVars, opts.variables)
    this.variables = deepClone(this.#defaultVars)
  }

  cacheResponse = (key:string, value:any) => {
    this.#responses[key] = {
      value,
      // Default timeout is 10 min
      time: Date.now() + 60000 * 10
    }
  }

  checkResponse = <T>(key:string) => {

    // --- Only use for testing --- //

    if(key.includes(`repos.listAll`))
      return projects.data.projects.nodes as T[]

    else if(key.includes(`repos.branches`))
      return branches.data.project.repository.branchNames as T[]

    // --- Only use for testing --- //


    const res = this.#responses[key]
    if(!res) return undefined
    const current = Date.now()
    const { value, time } = res

    if(current < time) return value as T[]

    this.#responses[key] = undefined
    return undefined
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

