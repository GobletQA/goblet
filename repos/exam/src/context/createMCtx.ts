import type { Context } from 'vm'
import type { IVMContext, TExFileModel } from '@GEX/types'

import { createContext } from 'vm'
import {mergeCtxs} from './createGCtx'
import { Module, createRequire } from 'module'


export const resolveMainMod = (cfg:IVMContext) => {
  const { exam } = cfg
  const mod = exam?.loader?.require?.main
    || cfg?.require?.main
    || require?.main

  return mod || new Module(exam?.loader?.rootDir)
}

export const createMCtx = (
  model:TExFileModel,
  gCtx:Context,
  mainModule:NodeJS.Module,
  reloadGlobal?:boolean
) => {
  const { location } = model

  const ctxModule = new Module(location, mainModule)

  ctxModule.filename = location
  ctxModule.require = createRequire(location)
  ctxModule.paths = mainModule?.paths ?? []

  // To be appended to the global context when a module is run
  const scope = {
    module: ctxModule,
    require: ctxModule.require,
    exports: ctxModule.exports,
    __dirname: ctxModule.path,
    __filename: ctxModule.filename,
  }
  
  const currentCtx = mergeCtxs(global, gCtx)
  const mCtx = mergeCtxs(currentCtx, scope)
  mCtx.global = mCtx
  mCtx.globalThis = mCtx

  return createContext(mCtx)
}

