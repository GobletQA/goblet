import { TLatentFile, TSaveData, TLoadOpts } from "./file.types"
import {ELatentEnv} from "./helpers.types"
import {TLatentTokenOpts} from "./token.types"
import {TLatentCryptoOpts} from "./crypto.types"


export type TLTRekey = {
  old:string
  updated:string
  location:string
  environment?:ELatentEnv
}

export type TLTLoad = Omit<TLatent, `token`> & {
  token?:string
  location?:string
}

export type TLTGet = Omit<TLTLoad, `location`> & {
  location:string
}

export type TLatent = {
  encoded?:string
  file?:TLatentFile
  token?:TLatentTokenOpts
  environment?:ELatentEnv
  crypto?:TLatentCryptoOpts
}


export type TLTSave = Omit<TLoadOpts, `data`|`format`> & Omit<TSaveData, `rekey`>
export type TLTCreate = Omit<TLTSave, `patch`|`data`> & {
  value?:any
  key?:string
  data?:Record<string, any>
}
export type TLTAdd = TLTSave
