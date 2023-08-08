import path from 'path'
import { execSync } from 'child_process'
import { GitRemoteRef } from '../constants'
import { ENVS } from '@gobletqa/environment/envs'
import { EFileType, Latent } from '@gobletqa/latent'
import { injectUnsafe } from '@GSH/utils/safeReplacer'
import { getGobletConfig } from '../goblet/getGobletConfig'
import { noOpObj, exists, deepFreeze } from '@keg-hub/jsutils'
import { getPathFromConfig } from '../utils/getPathFromConfig'

type TLoadEnvFile = {
  file?:string
  error?:boolean
  type:EFileType
  location?:string
}

type TMapOpts = {
  addNew?: boolean
  overwrite?: boolean
  replaceOnlyEmpty?: boolean
}

type TValuesObj = Record<string, any>

type TMapValues = {
  opts?:TMapOpts
  values:TValuesObj
  existing?:TValuesObj
}

const gitCmd = (repoRoot:string, ref:string) => execSync(
  `git config --get remote.${GitRemoteRef}.url`,
  { cwd: repoRoot }
)?.toString()?.trim()

const getGitRemote = (repoRoot:string) => {
  let url = (process.env.GB_GIT_REPO_REMOTE || ``).trim()

  try {
    if(!url){
      try {
        url = gitCmd(repoRoot, GitRemoteRef)
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

export class EnvironmentLoader {

  constructor(){}

  /**
   * Loads an env file
   */
  #envFile = ({
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

    if(ENVS.GB_REPO_NO_SECRETS) return {}

    const envUrl = ENVS.GB_GIT_REPO_REMOTE

    // Error is logged in the getGitRemote method
    const repoUrl = envUrl || getGitRemote(repoRoot)

    if(!repoUrl) return {}

    const token = latent.getToken(repoUrl)
    if(!token){
      console.log(`[ENV LOADER] Failed to get token from repoUrl`)
      console.log(repoUrl)
      console.log(config)
      return {}
    }
    try {
      return latent.secrets.get({ token, location: loc })
    }
    catch(err){
      console.log(err.message)

      return {}
    }

  }


  /**
   * Adds the key value to the passed in acc object
   */
  #setValue = (acc:TValuesObj, key:string, value:any) => {
    acc[key] = value

    return acc
  }

  /**
  * Maps loaded values to the passed in existing values object
  * Overwrites values based on options
  */
  #mapValues= ({
    values,
    existing=noOpObj,
    opts=noOpObj as TMapOpts,
  }:TMapValues) => {

    const {
      addNew=true,
      overwrite=true,
      replaceOnlyEmpty,
    } = opts

    return Object.entries(values)
      .reduce((acc, [key, value]) => {
        const keyExists = Boolean(key in acc)

        // If key doesn't exist, add the value is addNew is true, otherwise skip
        if(!keyExists)
          return addNew ? this.#setValue(acc, key, value) : acc

        // If key exists but is falsy
        // Only replace if replaceOnlyEmpty is true
        if(exists(replaceOnlyEmpty))
          return replaceOnlyEmpty === false
            ? this.#setValue(acc, key, value)
            : acc[key] === ''
              ? this.#setValue(acc, key, value)
              : acc

        // Else if key exists and overwrite true then replace, otherwise skip
        // Should never be hit when process.env is passed because replaceOnlyEmpty should always exists
        return overwrite ? this.#setValue(acc, key, value) : acc

      }, existing as TValuesObj)
  }

  /**
   * Makes calls to Latent to load env files from disk and parses into a key-value pair
   */
  load = (
    files:string[],
    type:EFileType,
    existing:Record<any, any>={}
  ) => {
    let loaded=existing
    
    try {
      loaded = files.reduce((acc, file) => {
        return this.#mapValues({
          existing: acc,
          values: this.#envFile({ file, type }),
        })
      }, existing as Record<any, any>)
    }
    catch(err){
      console.error(`[Environment Error] Error loading ${type} file`)
      console.log(err.message)
    }
    finally {

      // Inject both the secrets keys and values into the safe replaces
      // This is to ensure they are not leaked to the logs
      if(type === EFileType.secrets){
        injectUnsafe(Object.keys(loaded))
        injectUnsafe(Object.values(loaded))
      }

      return deepFreeze(loaded)
    }
  }

}

export const EnvLoader = new EnvironmentLoader() 