import {TLatentFile} from "./file.types"
import {ELatentEnv} from "./helpers.types"
import {TLatentTokenOpts} from "./token.types"
import {TLatentCryptoOpts} from "./crypto.types"

export type TLTRekey = {
  old:string
  update:string
  location:string
}

export type TLTLoad = TLatent & {
  location?:string
}

export type TLatent = {
  encoded?:string
  file?:TLatentFile
  token?:TLatentTokenOpts
  environment?:ELatentEnv
  crypto?:TLatentCryptoOpts
}