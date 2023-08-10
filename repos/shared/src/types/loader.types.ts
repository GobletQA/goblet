
export type TCfgMerge = { $merge?: string[] | false | null | undefined }
export type TLoadedFunc<T extends TCfgMerge> = (...args:any[]) => T

export type TLoopLoad<T extends TCfgMerge> = TLoadShared & {
  loadArr:string[]
  requireFunc?:TLoadedFunc<T>,
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
}
