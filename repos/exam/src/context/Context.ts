import type { IVMContext, TExFileModel, TVMRequireOpts } from '@GEX/types'

import { createGCtx, resetGCtx } from './createGCtx'
import {createMCtx, resolveMainMod} from './createMCtx'
import { Context, runInContext, createContext } from 'vm'
import {emptyObj} from '@keg-hub/jsutils'


export class VMContext {

  #context:Context
  #main:NodeJS.Module

  constructor(cfg:IVMContext){
    const { globals } = cfg
    this.#context = createGCtx(globals)
    this.#main = resolveMainMod(cfg)
  }

  #onModule = <T=any>(
    modCtx:Context,
    resp:T
  ) => {
    
    // Merge the module context back into the global context
    // This ensures any changes made within that module
    // Are reflected back to the original global context
    this.#context = resetGCtx(this.#context, modCtx)

    return resp
  }

  run = <T=any>(
    model:TExFileModel,
    content:string,
    opts:TVMRequireOpts
  ):T => {
    const modCtx = createMCtx(model, this.#context, this.#main, opts.global)
    const resp = runInContext(
      content || model.content,
      modCtx,
      opts
    ) as T

    modCtx.loaded = true

    return this.#onModule<T>(modCtx, resp)
  }

  require = <T=any>(
    model:TExFileModel,
    opts:TVMRequireOpts=emptyObj
  ):T => {
    const modCtx = createMCtx(model, this.#context, this.#main, opts.global)

    runInContext(
      model.content,
      modCtx,
      opts
    ) as T
    modCtx.loaded = true

    return this.#onModule<T>(modCtx, modCtx.exports)
  }

  getCtx = ():Context|null => {
    return this.#context
  }

  cleanup = () => {
    this.#main = undefined
    this.#context = undefined
  }

}
