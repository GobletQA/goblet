import type { TRepo } from '@GWF/types'

import type {
  TLTGet,
  TLTSave,
  TEnvObj,
  TLTLoad,
  TLTRekey,
  TLTGetSecrets,
  TFileSaveResp,
} from '@gobletqa/latent'

import { exists } from '@keg-hub/jsutils'
import { env } from '@keg-hub/parse-config'
import { injectUnsafe } from '@gobletqa/logger'
import { ELoadFormat, EFileType, Latent } from '@gobletqa/latent'

type TLTLSaveFile = {
  repo:TRepo
  content:string
  location:string
}

type TLTLGetFile = {
  repo:TRepo
  location:string
}

const getLatentType = (location:string) => {
  return location.includes(EFileType.secrets)
    ? EFileType.secrets
    : EFileType.values
}

export class LatentRepo {
  latent:Latent

  constructor(){
    this.latent = new Latent()
  }

  rekey = (props:TLTRekey):Error|undefined => {
    try {
      const failed = this.latent.secrets.rekey(props)

      return failed.length
        ? new Error(`The following keys failed to be rekeyed: \n${failed.join(`\n\t`)}`)
        : undefined
    }
    catch(err){
      return err
    }
  }

  decrypt = (props:TLTLoad & { remote:string }) => {
    const { remote, ...rest } = props

    const token = this.latent.getToken(props.remote)

    const secrets = this.latent.secrets.load({
      ...rest,
      token
    })

    // Inject both the secrets keys and values into the safe replaces
    // This is to ensure they are not leaked to the logs
    injectUnsafe(Object.keys(secrets))
    injectUnsafe(Object.values(secrets))

    return secrets
  }

  getFile = async (props:TLTLGetFile) => {
    const {
      repo,
      location
    } = props

    const token = this.latent.getToken(repo.git.remote)
    const type = getLatentType(location)

    const args = {
      type,
      token,
      location,
      format:ELoadFormat.string,
      environment: repo.environment
    }

    const content = type === EFileType.secrets
      ? this.latent.secrets.get(args as TLTGetSecrets)
      : this.latent.values.get(args as TLTGet)

    return exists(content)
      ? [undefined, content]
      : [new Error(`Could not load ${type} file content`), undefined]

  }
  
  saveFile = async (props:TLTLSaveFile) => {
    const {
      repo,
      content,
      location
    } = props

    const token = this.latent.getToken(repo.git.remote)
    const type = getLatentType(location)
    const data = env.parse(content) as TEnvObj

    const args = {
      data,
      type,
      token,
      location,
      replace: true,
      environment: repo.environment
    }
    
    try {

      let saved:TFileSaveResp
      if(type === EFileType.secrets){
        console.log(`Repo secrets are being updated...`)
        saved = this.latent.secrets.save(args as TLTSave)
      }
      else {
        console.log(`Repo values are being updated...`)
        saved = this.latent.values.save(args as TLTSave)
      }

      const { failed } = saved
      const success = (!failed || failed?.length === 0)

      return [
        success ? undefined : new Error(`Failed to properly save ${type} file`),
        success
      ]
    }
    catch(err){
      return [err, undefined]
    }
  }
  
  encrypt = () => {
    
  }
  
}


export const latentRepo = new LatentRepo()

