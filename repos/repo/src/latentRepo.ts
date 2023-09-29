import type { Repo } from '@GRP/types'

import type {
  TLTGet,
  TLTSave,
  TEnvObj,
  TLTLoad,
  TLTRekey,
  TLTGetSecrets,
  TFileSaveResp,
} from '@gobletqa/latent'

import { env } from '@keg-hub/parse-config'
import { ENVS } from '@gobletqa/environment'
import { exists } from '@keg-hub/jsutils/exists'
import { GobletConfigRef } from '@gobletqa/environment/constants'
import { ELoadFormat, EFileType, Latent } from '@gobletqa/latent'

type TTokenProps = { remote:string, ref?:string }

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

const getRepoRef = ({ref, remote}:TTokenProps) => {
  const found = ref || ENVS.GB_REPO_CONFIG_REF
  return found && found !== GobletConfigRef
    ? found
    : remote || ENVS.GB_GIT_REPO_REMOTE
}

export class LatentRepo {
  latent:Latent

  constructor(){
    this.latent = new Latent()
  }

  repoToken = (props:TTokenProps) => {
    return ENVS.GOBLET_TOKEN
      || this.latent.getToken(getRepoRef(props))
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

  decrypt = (props:TLTLoad & { remote:string, ref?:string }) => {
    const { ref, remote, ...rest } = props
    const token = this.repoToken(props)

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

    const token = this.repoToken({
      ref: repo.$ref,
      remote: repo.git.remote
    })

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

    const token = this.repoToken({
      ref: repo.$ref,
      remote: repo.git.remote
    })

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
      console.log(`[Latent Repo] Save File Error`, err.message)
      return [err, undefined]
    }
  }
  
  encrypt = () => {
    
  }
  
}


export const latentRepo = new LatentRepo()

