import { Logger } from '@GWF/utils/logger'

import { ensureArr } from '@keg-hub/jsutils/ensureArr'

export type TCacheRef = string
export type TCacheName = string
export type TNameORRef = TCacheName|TCacheRef

export class WfCache {

  #cache:Record<string, any>={}
  #refMap:Record<string, string>={}

  #getRefs = (ref:TNameORRef) => {
    const name = this.#refMap[ref] || ref

    let match:string

    const refs = Object.entries(this.#refMap)
      .reduce((acc, [key, val]) => {
        if(key === ref || val === name){
          acc.push(key)
          match = val
        }
        return acc
      }, [])
    
    return {refs, match}
  }

  #clearRefs = (name:string) => {
    const {refs, match} = this.#getRefs(name)
    match && this.#remove(match)

    refs?.length
     && refs.forEach((ref) => {
        delete this.#refMap[ref]
        Logger.info(`[WF Cache] - Ref:${ref} (${name}) cache removed successfully`)
      })

  }

  #addRefs = (refs:string|string[], name:string) => {
    ensureArr(refs).forEach(ref => {
      const existing = this.#refMap[ref]
      if(existing && existing !== name)
        return Logger.warn(`[WF Cache] - Ref "${ref}" already exist as a ref for "${existing}"`)

      this.#refMap[ref] = name
    })
  }

  #findRefCache = (ref:TCacheRef) => {
    const {match} = this.#getRefs(ref)
    return this.#cache[match]
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

  refs = () => {
    return this.#refMap
  }
  
  clearCache = ()=> {
    this.#cache = {}
  }

  clearRefs = ()=> {
    this.#refMap = {}
  }

  clearAll = ()=> {
    this.#cache = {}
    this.#refMap = {}
  }

  find = (name:TNameORRef) => {
    const found = this.#cache[name] || this.#findRefCache(name)
    found && Logger.info(`[WF Cache Hit] - ${name}`)

    return found
  }
  
  save = (cacheName:TNameORRef, data:any, ref?:TCacheRef|TCacheRef[]) => {
    // Check if the name is already used as a ref, and if so use it's ref name
    const link = this.#refMap[cacheName]
    const name = link ?? cacheName
    link && Logger.warn(`[WF Cache] - "${cacheName}" is a ref for "${name}"; updating "${name}" cache`)

    const refArr = ref ? ensureArr<TCacheRef>(ref) : []
    this.#cache[name] = data

    let msg = ``

    if(refArr?.length){
      this.#addRefs(refArr, name)
      msg = ` | Refs: ${refArr.join(`, `)}`
    }

    Logger.info(`[WF Cache] - Saved cache (Name: ${name}${msg})`)
  }

  remove = (name:TNameORRef) => {
    this.#clearRefs(name)
    this.#remove(name)
    Logger.info(`[WF Cache] - Cache "${name}" removed successfully`)
  }

}


export const wfcache = new WfCache()