import type { TGobletExtEnvs } from '@GENV/types'

import git from './git'
import test from './test'
import repo from './repo'
import joker from './joker'
import general from './general'
import backend from './backend'
import browser from './browser'
import conductor from './conductor'
import screencast from './screencast'
import playwright from './playwright'
import {exists} from '@keg-hub/jsutils/exists'

const buildEnvs = () => {
  const generalEnvs = general()
  const scEnvs = screencast(generalEnvs)
  
  return {
    ...generalEnvs,
    ...scEnvs,
    ...git(generalEnvs),
    ...repo(generalEnvs),
    ...test(generalEnvs),
    ...joker(generalEnvs),
    ...backend(generalEnvs),
    ...conductor(generalEnvs),
    ...playwright(generalEnvs),
    ...browser(generalEnvs, scEnvs),
  }
}

// Single location export of all envs that other repos reuse
class GobletEnvs {
  #envs:Record<string, any>={}

  constructor(){
    this.#envs = buildEnvs()
    return new Proxy(process.env, this)
  }

  get(target:any, prop:string, receiver:NodeJS.ProcessEnv){
    if(!exists(this.#envs[prop]))
      this.#envs[prop] = Reflect.get(target, prop, receiver)

    return this.#envs[prop]
  }

  set(target:any, prop:string, val:any){
    this.#envs[prop] = val
    return val === undefined || val === null
      ? Reflect.deleteProperty(target, prop)
      : Reflect.set(target, prop, val)
  }

  deleteProperty(target:any, prop:string) {
    delete this.#envs[prop]
    return Reflect.deleteProperty(target, prop)
  }

}

export const GEnvs = new GobletEnvs() as unknown as NodeJS.ProcessEnv
export const ENVS = GEnvs as unknown as ReturnType<typeof buildEnvs> & TGobletExtEnvs
