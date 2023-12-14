

export class WfCache {

  #cache:Record<string, any>={}
  #refMap:Record<string, string>={}

  find = (name:string) => this.#cache[name] || this.#cache[this.#refMap[name]]
  
  save = (name:string, data:any, ref?:string) => {
    this.#cache[name] = data
    ref && this.ref(ref, name)
  }

  ref = (ref:string, name:string) => {
    this.#refMap[ref] = name
    if(ref) this.#refMap[name] = ref
  }

  remove = (name:string) => {

    this.#cache[name] = undefined
    delete this.#cache[name]

    const ref = this.#refMap[name]
    if(!ref) return

    this.#cache[ref] = undefined
    delete this.#cache[ref]

    delete this.#refMap[name]
    delete this.#refMap[ref]
  }

}


export const wfcache = new WfCache()