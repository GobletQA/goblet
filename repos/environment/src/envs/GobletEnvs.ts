import git from './git'
import test from './test'
import repo from './repo'
import general from './general'
import backend from './backend'
import screencast from './screencast'
import {exists, toBool, toNum, toStr} from '@keg-hub/jsutils'

const buildEnvs = () => {
  const generalEnvs = general()
  
  return {
    ...generalEnvs,
    ...git(generalEnvs),
    ...repo(generalEnvs),
    ...test(generalEnvs),
    ...backend(generalEnvs),
    ...screencast(generalEnvs),
  }
}

// Single location export of all envs that other repos reuse
export class GobletEnvs {
  #envs:Record<string, any>={}

  constructor(){
    this.#envs = buildEnvs()
    return new Proxy(this.#envs, this)
  }

  #isSame = (env1:any, env2:string) => {
    /** If they are the same, then just return */
    if(env1 === env2) return env1
    
    /** If no env 1, just return env 2 */
    const hasOne = exists(env1)
    if(!hasOne) return env2

    /** If env 1, and no env 2, then return 1 */
    const hasTwo = exists(env2)
    if(!hasTwo) return env1

    /** If env 1, and env 2, and they are the same, return either one */
    if(toStr(env1) === env2) return env1 

    // We assume env2 has change since env1 was set
    // So find env1's type, and convert env2 to the same type
    switch(typeof env1){
      case `string`: return env2
      case `number`: return toNum(env2)
      case `boolean`: return toBool(env2)
      // TODO: add array and object here if needed
    }

  }

  get(target:any, prop:string){
    const val = this.#isSame(this.#envs[prop], process.env[prop])
    this.#envs[prop] = val

    return this.#envs[prop]
  }

  set(target:any, prop:string, val:any){
    this.#envs[prop] = val
    process.env[prop] = val

    return true
  }
}

export const ENVS = new GobletEnvs() as unknown as ReturnType<typeof buildEnvs>


