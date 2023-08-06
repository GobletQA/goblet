
import { exam } from './exam'
import { general } from './general'
import { screencast } from './screencast'

const buildEnvs = () => {
  const generalEnvs = general()
  return {
    ...generalEnvs,
    ...screencast(generalEnvs),
    ...exam(generalEnvs),
  }
}

// Single location export of all envs that other repos reuse
export class GobletEnvs {
  #envs:Record<string, any>={}

  constructor(){
    this.#envs = buildEnvs()
    return new Proxy(this.#envs, this)
  }

  get(target:any, prop:string){
    const val = this.#envs[prop] || process.env[prop]
    return val
  }

  set(target:any, prop:string, val:any){
    this.#envs[prop] = val
    process.env[prop] = val

    return true
  }
}

export const ENVS = new GobletEnvs() as unknown as ReturnType<typeof buildEnvs>


