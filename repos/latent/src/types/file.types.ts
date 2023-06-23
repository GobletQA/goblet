import { EFileType, ELoadFormat, ELatentEnv } from "./helpers.types"


export type TLoadOpts = {
  type: EFileType
  environment:ELatentEnv
  data?:Record<any, any>
}

export type TLatentFile = TLoadOpts & {
  
}

export type TFileContentOpts = TLoadOpts & {
  location:string
}