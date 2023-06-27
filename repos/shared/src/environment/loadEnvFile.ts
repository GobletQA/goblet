

import path from 'path'
import { execSync } from 'child_process'
import { EFileType, Latent } from '@gobletqa/latent'
import { getGobletConfig } from '../goblet/getGobletConfig'
import { getPathFromConfig } from '../utils/getPathFromConfig'

const { GB_GIT_REMOTE_REF=`goblet-ref` } = process.env

type TLoadEnvFile = {
  file?:string
  error?:boolean
  type:EFileType
  location?:string
}

const getGitRemote = (repoRoot:string) => {
  try {
    return execSync(`git config --get remote.${GB_GIT_REMOTE_REF}.url`, { cwd: repoRoot })
      ?.toString()?.trim()
  }
  catch(err){
    console.log(`[ENV LOADER] Failed to get goblet repo remote url`)
    console.log(err.message)
    return ``
  }
}

export const loadEnvFile = ({
  file,
  type,
  location,
  error=false,
}: TLoadEnvFile):Record<string, any> => {

  const config = getGobletConfig()
  if(!config){
    console.log(`[ENV LOADER] Failed to get Goblet Config`)
    return {}
  }
  
  const { repoRoot } = config.paths
  if(!repoRoot){
    console.log(`[ENV LOADER] Failed to get repoRoot`)
    console.log(config)
    return {}
  }

  const environmentsDir = getPathFromConfig(`environmentsDir`, config)

  if(!environmentsDir){
    console.log(`[ENV LOADER] Failed to get environmentsDir`)
    console.log(config)
    return {}
  }

  const loc = location || path.join(environmentsDir, file)

  // Error is logged in the getGitRemote method
  const repoUrl = getGitRemote(repoRoot)
  if(!repoUrl) return {}

  const latent = new Latent()
  const token = latent.getToken(repoUrl)
  if(!token){
    console.log(`[ENV LOADER] Failed to get token from repoUrl`)
    console.log(repoUrl)
    console.log(config)
    return {}
  }

  return type === EFileType.secrets
    ? latent.secrets.get({ token, location: loc })
    : latent.values.get({ token, location: loc })

}
