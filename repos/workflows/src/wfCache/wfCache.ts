import { Logger } from '@GWF/utils/logger'

import { ensureArr } from '@keg-hub/jsutils/ensureArr'

export type TCacheRef = string
export type TCacheName = string
export type TNameORRef = TCacheName|TCacheRef

export class WfCache {

  #cache:Record<string, any>={}
  #refMap:Record<string, string>={}

  #getRefs = (ref:string) => {
    const name = this.#refMap[ref]

    return Object.entries(this.#refMap)
      .reduce((acc, [key, val]) => {
        val === name && acc.push(key)
        return acc
      }, [])
  }

  #addRefs = (refs:string|string[], name:string) => {
    ensureArr(refs).forEach(ref => this.#refMap[ref] = name)
  }

  #findRefCache = (ref:TCacheRef) => {
    const name = this.#refMap[ref]
    return this.#cache[name]
  }

  #remove = (name:TCacheName) => {
    if(this.#cache[name]){
      this.#cache[name] = undefined
      delete this.#cache[name]
    }
  }

  cache = () => {
    return this.#cache
  }

  find = (name:TNameORRef) => {
    const found = this.#cache[name] || this.#findRefCache(name)
    found && Logger.info(`[WF Cache Hit] - ${name}`)

    return found
  }
  
  save = (name:TCacheName, data:any, ref?:TCacheRef|TCacheRef[]) => {
    const refArr = ref ? ensureArr<TCacheRef>(ref) : []
    this.#cache[name] = data

    let msg = ``

    if(refArr?.length){
      this.#addRefs(refArr, name)
      msg = ` | Refs: ${refArr.join(`, `)}`
    }

    Logger.info(`[WF Cache Save] - Name: ${name}${msg}`)
  }

  remove = (name:TNameORRef) => {
 
    const refCache = this.#findRefCache(name)

    if(!this.#cache[name] && !refCache){
      Logger.warn(`[WF Cache WARN] - No cache found for "${name}"`)
      Logger.log(`Cache:`, this.#cache)
      Logger.log(`RefMap:`, this.#refMap)
      return
    }

    this.#remove(name)

    Logger.info(`[WF Cache Cleared] - ${name} cache removed successfully`)
    if(!refCache)
      return Logger.info(`[WF Cache Cleared] - No refs found, skipping ref remove`)

    const refs = this.#getRefs(name)

    refs?.length
     && refs.forEach((ref) => {
        const match = this.#refMap[ref]
        this.#remove(match)

        delete this.#refMap[ref]

        Logger.info(`[WF Cache Cleared] - Ref:${ref} (${name}) cache removed successfully`)
      })

  }

}


export const wfcache = new WfCache()