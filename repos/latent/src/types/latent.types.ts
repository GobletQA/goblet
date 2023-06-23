import {TLatentFile} from "./file.types"
import {ELatentEnv} from "./helpers.types"
import {TLatentTokenOpts} from "./token.types"
import {TLatentCryptoOpts} from "./crypto.types"


export type TLTLoad = TLatent & {
  location?:string
}

export type TLatent = {
  encoded?:string
  environment?:ELatentEnv
  file?:TLatentFile
  token?:TLatentTokenOpts
  crypto?:TLatentCryptoOpts
}