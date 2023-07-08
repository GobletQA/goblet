

import path from 'path'
import { execSync } from 'child_process'
import { EFileType, Latent } from '@gobletqa/latent'
import { getGobletConfig } from '../goblet/getGobletConfig'
import { getPathFromConfig } from '../utils/getPathFromConfig'
import { GBGitRemoteRef, GBMountedRemoteKey } from '../constants/git'

type TLoadEnvFile = {
  file?:string
  error?:boolean
  type:EFileType
  location?:string
}

const gitCmd = (repoRoot:string, ref:string) => execSync(
  `git config --get remote.${GBGitRemoteRef}.url`,
  { cwd: repoRoot }
)?.toString()?.trim()

const getGitRemote = (repoRoot:string) => {
  let url = (process.env[GBMountedRemoteKey] || ``).trim()

  try {
    if(!url){
      try {
        url = gitCmd(repoRoot, GBGitRemoteRef)
      }
      catch(err){
        url = gitCmd(repoRoot, `origin`)
      }
    }
  }
  catch(err){
    console.log(`[ENV LOADER] Failed to get goblet repo remote url`)
    console.log(err.message)
    return ``
  }

  return url.replace(/\.git$/, ``)
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
  const latent = new Latent()

  if(type !== EFileType.secrets)
    return latent.values.get({ location: loc })

  // Error is logged in the getGitRemote method
  const repoUrl = getGitRemote(repoRoot)

  if(!repoUrl) return {}

  const token = latent.getToken(repoUrl)
  if(!token){
    console.log(`[ENV LOADER] Failed to get token from repoUrl`)
    console.log(repoUrl)
    console.log(config)
    return {}
  }

  return latent.secrets.get({ token, location: loc })

}
