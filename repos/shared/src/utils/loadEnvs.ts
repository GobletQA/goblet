import path from 'path'

import { noPropArr } from '@keg-hub/jsutils'
import { addToProcess } from '@keg-hub/cli-utils'

export type TLoadConfigs = {
  env?:string,
  name?:string,
  error?:boolean
  pattern?:RegExp
  fill?:boolean
  noEnv?:boolean
  noYml?:boolean
  ymlName?:string
  ymlPath?:string
  locations?:string[],
  data?:Record<any, any>
  format?:'string'|'object'
}

export type TLoadEnvs = TLoadConfigs & {
  force?:boolean
  override?:boolean
}

const appRoot = path.join(__dirname, '../../../')

const testRemovePrefix = [
  `KEG_`,
  `DOC_`,
  `GB_BE_JWT_`,
  `GITHUB_`,
  `GITLAB_`
]

const testRemoveIncludes = [
  `SECRET`,
  `TOKEN`,
  `PASSWORD`
]

/**
 * Cache holder for the loaded envs
 * @type {Object}
 */
let __LOADED_ENVS__:Record<string, string|boolean|number>

/**
 * Loads the goblet envs from .env and yaml values files 
 * @param {Object} options - Options for loading the env files
 * @param {boolean} [override=true] - Should the envs be added to the current process
 * 
 * @returns {Object} - Loaded Envs object
 */
export const loadEnvs = ({
  env,
  force,
  override,
  name=`goblet`,
  locations=noPropArr,
  ...envOpts
}:TLoadEnvs) => {
  const nodeEnv = process.env.NODE_ENV || env || `local`

  // When running in test environment
  // Ensure specific envs don't get loaded
  if(process.env.JEST_WORKER_ID !== undefined){
    Object.entries(process.env)
      .map(([key, val ]) => {
        const shouldRemove = testRemovePrefix.find(prefix => key.startsWith(prefix)) ||
          testRemoveIncludes.find(word => key.includes(word))

        if(!shouldRemove) return

        process.env[key] = undefined
        delete process.env[key]
      })

    return {}
  }

  __LOADED_ENVS__ = (!force && __LOADED_ENVS__)
    || require('@keg-hub/parse-config').loadConfigs({
    name,
    env: nodeEnv,
    locations: [ ...locations, appRoot],
    ...envOpts,
  })

  // Ensure node ENV is set is it doesn't exist
  if(!process.env.NODE_ENV) process.env.NODE_ENV = (__LOADED_ENVS__.NODE_ENV || env || `local`) as string

  // Add the loaded envs to process.env if override is set
  // Or env if local, and override is not explicitly set to false
  addToProcess(__LOADED_ENVS__, {force: override || (nodeEnv === 'local' && override !== false)})

  return __LOADED_ENVS__
}

