import { EFileType, ELoadFormat, ELatentEnv } from "./helpers.types"


export type TLoadOpts = {
  type: EFileType
  location:string
  format?:ELoadFormat
  data?:Record<any, any>
  environment?:ELatentEnv
}

export type TSaveOpts = Omit<TLoadOpts, `data`> & {
  data:TEnvObj
  patch?:boolean
}

export type TFileOpts = {
  type: EFileType
  location:string
  format:ELoadFormat
  data:Record<any, any>
  environment:ELatentEnv
}

export type TEnvObj = Record<string, any>


export type TLatentFile = Omit<TLoadOpts, `location`|`type`> & {}
