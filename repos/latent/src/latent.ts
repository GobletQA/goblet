import type {
  TLatent,
  TLTLoad,
  TLTSave,
} from "@GLT/types"

import {
  EFileType,
  ELatentEnv,
} from "@GLT/types"
import { Values } from '@GLT/values'
import { Secrets } from '@GLT/secrets'
import { ENVS } from '@gobletqa/environment'
import { LatentFile } from '@GLT/services/file'
import { LatentToken } from '@GLT/services/token'
import {emptyObj} from "@keg-hub/jsutils/emptyObj"
import { LatentCrypto } from '@GLT/services/crypto'


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
      ENVS.GOBLET_ENV && (ENVS.GOBLET_ENV in ELatentEnv)
        ? ENVS.GOBLET_ENV as ELatentEnv
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
    const { location, token, data, patch, replace } = props
    const environment = props.environment
      || this.environment
      || ELatentEnv.develop

    return this.file.save({
      data,
      type,
      token,
      patch,
      replace,
      location,
      environment,
    })
  }

  getToken = (ref:string, ltToken?:string) => {
    return this.token.generate(ref, ltToken)
  }

}
