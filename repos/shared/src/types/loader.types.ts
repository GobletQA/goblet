import {TGobletConfig} from "./configs.types"

export type TCfgMerge = { $merge?: string[] | false | null | undefined }

export type TLoadedFunResp<T=any> = {
  data: T
  location?:string
}

export type TRequiredFun<T extends TCfgMerge> = (...args:any) => T

export type TLoadedFunc<T extends TCfgMerge> = (...args:any[]) => TLoadedFunResp<T>

export type TLoopLoad<T extends TCfgMerge> = TLoadShared & {
  loadArr:string[]
  addLocation?:boolean
  requireFunc?:TLoadedFunc<T>
}

export type TLoadShared = {
  type?:string
  safe?: boolean
  first?: boolean
  basePath:string
  merge?: string[] | false | null | undefined
}

export type TSearchFile = TLoadShared & {
  file:string
  location?:string
  clearCache?:boolean
}

export type TLoader = TLoadShared & {
  loadArr?:string[]
  addLocation?:boolean
}

export type TGobletLoaderRef = {
  ref:string
  remote?:never
}
export type TGobletLoaderRemote = {
  ref?:never
  remote:string
}

export type TGobletLoader = TLoader & (TGobletLoaderRef | TGobletLoaderRemote)

export type TCfgRefFolder = {
  ref:string|undefined
  remote?:never
}

export type TCfgRemoteFolder = {
  ref?:never|undefined
  remote:string
}

export type TCfgFolder = (TCfgRefFolder|TCfgRemoteFolder)

