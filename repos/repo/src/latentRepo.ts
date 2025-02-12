import type { Repo } from '@GRP/repo'
import type { TGitOpts } from '@gobletqa/git'

import type {
  TLTGet,
  TLTSave,
  TEnvObj,
  TLTLoad,
  TLTRekey,
  TLTGetSecrets,
  TFileSaveResp,
} from '@gobletqa/latent'

import { git } from '@gobletqa/git'
import { Logger } from '@GRP/utils/logger'
import { env } from '@keg-hub/parse-config'
import { ENVS } from '@gobletqa/environment'
import { exists } from '@keg-hub/jsutils/exists'
import { injectKeyValues } from '@gobletqa/logger'
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

    secrets && injectKeyValues(secrets)

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
    const isSecrets = type === EFileType.secrets

    const args = {
      type,
      token,
      location,
      format:ELoadFormat.string,
      environment: repo.environment
    }
    

    const content = isSecrets
      ? this.latent.secrets.get(args as TLTGetSecrets)
      : this.latent.values.get(args as TLTGet)
      
    isSecrets
      && content
      && injectKeyValues(content)

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
        Logger.debug(`Repo secrets are being updated...`)
        data && injectKeyValues(data)
        saved = this.latent.secrets.save(args as TLTSave)
      }
      else {
        Logger.debug(`Repo values are being updated...`)
        saved = this.latent.values.save(args as TLTSave)
      }

      const { failed } = saved
      const success = (!failed || failed?.length === 0)

      if(success){
        const [addErr] = await git.add(
          /**
          * **IMPORTANT** - Does not include the users Git Provider Token
          */
          {...repo.git, local: repo.paths.repoRoot} as TGitOpts,
          /**
           * Force add the file as the files are not tracked in git by default
           */
          {args: [`--force`], locations: [location]}
        )

        if(addErr) throw addErr

        return [undefined, success]
      }

      return [new Error(`Failed to properly save ${type} file`), success]
    }
    catch(err){
      Logger.error(`[Latent Repo] Save File Error`, err.message)
      return [err, undefined]
    }
  }
  
  encrypt = () => {
    
  }
  
}


export const latentRepo = new LatentRepo()

