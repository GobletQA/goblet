import { Logger } from '@GWF/utils/logger'

export class WfCache {

  #cache:Record<string, any>={}
  #refMap:Record<string, string>={}

  find = (name:string) => {
    const found = this.#cache[name] || this.#cache[this.#refMap[name]]
    found && Logger.info(`[Workflows Cache Hit] - ${name}`)

    return found
  }
  
  save = (name:string, data:any, ref?:string) => {
    this.#cache[name] = data
    ref && this.ref(ref, name)
    const msg = ref ? ` | Ref: ${ref}` : ``
    Logger.info(`[Workflows Cache Save] - Name: ${name}${msg}`)
  }

  ref = (ref:string, name:string) => {
    this.#refMap[ref] = name
    if(ref) this.#refMap[name] = ref
  }

  remove = (name:string) => {

    this.#cache[name] = undefined
    delete this.#cache[name]

    const ref = this.#refMap[name]
    if(!ref){
      return Logger.info(`[Workflows Cache Cleared] - ${name} cache removed successfully`)
    }

    this.#cache[ref] = undefined
    delete this.#cache[ref]

    delete this.#refMap[name]
    delete this.#refMap[ref]

    Logger.info(`[Workflows Cache Cleared] - ${name} & ${ref} cache removed successfully`)
  }

}


export const wfcache = new WfCache()