export type TGetFilesOpts = {
  filters?: {
    contains?: string[]
    endsWith?: string[]
    startsWith?: string[]
  }
}

export type TBuildFound = {
  file?:string
  allFound:string[]
  fromPath?:string
  opts:TBuildFoundOpts
  recurCall?:(...args:any[]) => any
}

export type TBuildFoundOpts = {
  type?:string
  full?:boolean
  exclude?:string[]
  include?:string[]
  recursive?:boolean
}
