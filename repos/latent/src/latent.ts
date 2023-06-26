import {
  TLatent,
  TLTLoad,
  TLTSave,
  EFileType,
  ELatentEnv,
} from "@GLT/types"

import { Values } from '@GLT/values'
import { Secrets } from '@GLT/secrets'
import {emptyObj} from "@keg-hub/jsutils"
import { LatentFile } from '@GLT/services/file'
import { LatentToken } from '@GLT/services/token'
import { LatentCrypto } from '@GLT/services/crypto'


const {
  GOBLET_ENV
} = process.env

export class Latent {

  encoded:string
  values:Values
  secrets:Secrets
  file:LatentFile
  token:LatentToken
  crypto:LatentCrypto
  #environment:ELatentEnv

  get environment(){
    return this.#environment
  }

  set environment(environment:ELatentEnv){
    this.#environment = environment
  }

  constructor(props:TLatent=emptyObj){
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
    this.file = new LatentFile(file, this)

    this.values = new Values(this)
    this.secrets = new Secrets(this)
  }

  load = (props:TLTLoad, type:EFileType) => {
    const { location, token } = props
    const environment = props.environment
      || this.environment
      || ELatentEnv.develop

    return this.file.loadAll({
      type,
      token,
      location,
      environment
    })
  }

  save = (props:TLTSave, type:EFileType) => {
    const { location, token, data, patch } = props
    const environment = props.environment
      || this.environment
      || ELatentEnv.develop

    return this.file.save({
      data,
      type,
      token,
      patch,
      location,
      environment,
    })
  }

  getToken = (ref:string) => {
    return this.token.generate(ref)
  }

}
