import {
  TLatent,
  TLTLoad,
  EFileType,
  ELatentEnv,
} from "@GLT/types"

import { LatentFile } from '@GLT/services/file'
import { LatentToken } from '@GLT/services/token'
import { LatentCrypto } from '@GLT/services/crypto'

const {
  GOBLET_ENV
} = process.env

//  TODO: combine LatentToken & LatentCrypto & LatentFile
export class Latent {

  encoded:string
  file:LatentFile
  token:LatentToken
  crypto:LatentCrypto
  #environment:ELatentEnv

  get environment(){
    return this.#environment
  }

  set environment(environment:ELatentEnv){
    this.#environment = environment
    this.file.environment = environment
  }

  constructor(props:TLatent){
    const {
      file,
      token,
      crypto,
      environment
    } = props

    this.#environment = environment || (
      GOBLET_ENV && (GOBLET_ENV in ELatentEnv)
        ? GOBLET_ENV as ELatentEnv
        : ELatentEnv.develop
    )

    this.token = new LatentToken(token)
    this.crypto = new LatentCrypto(crypto)
    this.file = new LatentFile({
      ...file,
      environment: this.environment
    }, this)
  }

  #load = (props:TLTLoad, type:EFileType) => {
    const { location } = props
    const environment = props.environment
      || this.environment
      || ELatentEnv.develop

    return this.file.load({ type, location, environment })
  }

  loadValues = (props:TLTLoad) => {
    return this.#load(props, EFileType.values)
  }

  loadSecrets = (props:TLTLoad) => {
    return this.#load(props, EFileType.secrets)
  }

  getToken = (ref:string) => {
    return this.token.generate(ref)
  }

}