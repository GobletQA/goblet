import type { Repo } from '@GSH/repo/repo'
import type { TEnvObj, TLTLoad, TLTRekey } from '@gobletqa/latent'

import { exists } from '@keg-hub/jsutils'
import { env } from '@keg-hub/parse-config'
import { ELoadFormat, EFileType, Latent } from '@gobletqa/latent'

type TLTLSaveFile = {
  repo:Repo
  content:string
  location:string
}

type TLTLGetFile = {
  repo:Repo
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
      ? this.latent.secrets.get(args)
      : this.latent.values.get(args)

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
      const saved = type === EFileType.secrets
        ? this.latent.secrets.save(args)
        : this.latent.values.save(args)


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

