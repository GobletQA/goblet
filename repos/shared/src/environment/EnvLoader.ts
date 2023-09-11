import type { TGobletConfig } from '@GSH/types'

import path from 'path'
import { execSync } from 'child_process'
import { GitRemoteRef } from '../constants'
import { exists } from '@keg-hub/jsutils/exists'
import { ENVS } from '@gobletqa/environment/envs'
import { EFileType, Latent } from '@gobletqa/latent'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { deepFreeze } from '@keg-hub/jsutils/deepFreeze'
import { getPathFromConfig, getGobletConfig } from '@gobletqa/goblet'

type TTokenProps = {
  ref?:string
  root:string
  remote?:string
}

type TLoadEnvFile = {
  file?:string
  error?:boolean
  type:EFileType
  location?:string
  config:TGobletConfig
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
  if(url) return url

  try {
    try {url = gitCmd(repoRoot, GitRemoteRef)}
    catch(err){ url = gitCmd(repoRoot, `origin`)}
  }
  catch(err){
    console.log(`[ENV LOADER] Failed to get goblet repo remote url`)
    console.log(err.message)
    return ``
  }

  return url.replace(/\.git$/, ``)
}

const getRepoRef = ({ref, remote, root}:TTokenProps) => {
  const found = ref
    || ENVS.GB_REPO_CONFIG_REF
    || remote
    || ENVS.GB_GIT_REPO_REMOTE
  
  if(found) return found

  return getGitRemote(root)
}


export class EnvironmentLoader {
  latent:Latent

  constructor(){
    this.latent = new Latent()
  }

  #repoToken = (props:TTokenProps) => {
    return ENVS.GOBLET_TOKEN
      || this.latent.getToken(getRepoRef(props))
  }

  /**
   * Loads an env file
   */
  #envFile = ({
    file,
    type,
    config,
    location,
    error=false,
  }: TLoadEnvFile):Record<string, any> => {

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
    this.latent = new Latent()

    if(type !== EFileType.secrets)
      return this.latent.values.get({ location: loc })

    if(ENVS.GB_REPO_NO_SECRETS) return {}

    const token = this.#repoToken({
      root: repoRoot,
      ref: config.$ref,
    })

    if(!token){
      console.log(`[ENV LOADER] Failed to get token from repo ref`)
      console.log(config)
      return {}
    }
    try {
      return this.latent.secrets.get({ token, location: loc })
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

    const config = getGobletConfig()
    if(!config){
      console.log(`[ENV LOADER] Failed to get Goblet Config`)
      return {}
    }

    try {
      loaded = files.reduce((acc, file) => {
        return this.#mapValues({
          existing: acc,
          values: this.#envFile({ file, type, config }),
        })
      }, existing as Record<any, any>)
    }
    catch(err){
      console.error(`[Environment Error] Error loading ${type} file`)
      console.log(err.message)
    }
    finally {
      return deepFreeze(loaded)
    }
  }

}

export const EnvLoader = new EnvironmentLoader()
