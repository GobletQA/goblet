import { EFileType, ELoadFormat, ELatentEnv } from "./helpers.types"


export type TLoadOpts = {
  token?:string
  type:EFileType
  location:string
  format?:ELoadFormat
  data?:Record<any, any>
  environment?:ELatentEnv
}

export type TReadOpts = Omit<TLoadOpts, `format`> & {
  format:ELoadFormat
}


export type TLoadSingleOpts = TLoadOpts & {
  fill?:boolean
  error?:boolean
}

type TSaveRekey = {
  data?:never
  patch?:never
  rekey:boolean
  current:TEnvObj
}

export type TSaveData = {
  rekey?:never
  data:TEnvObj
  patch?:boolean
  current?:TEnvObj
}
type TSaveParams = TSaveData | TSaveRekey

export type TSaveOpts = Omit<TLoadOpts, `data`|`format`> & TSaveParams

export type TFileNames = {
  location:string
  type: EFileType
  environment:ELatentEnv
}

export type TFileOpts = {
  patch?:boolean
  rekey?:boolean
  type: EFileType
  location:string
  format:ELoadFormat
  data:Record<any, any>
  environment:ELatentEnv
}

export type TEnvObj = Record<string, any>


export type TLatentFile = Omit<TLoadOpts, `location`|`type`|`environment`> & {}


export type TFileSaveResp = {
  failed?: string[]
  location:string
}
