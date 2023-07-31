import type { TWorldConfig } from '@ltipton/parkin'
import type { TGitData, TRepoPaths, TGobletConfig, TRepo } from '@GWF/types'

import { loaderSearch } from '@gobletqa/shared/libs/loader'
import { noOpObj, deepMerge } from '@keg-hub/jsutils/src/node'
import { DefWorld, GBMountedRemoteKey } from '@gobletqa/shared/constants'
import { getGobletConfig } from '@gobletqa/shared/goblet/getGobletConfig'
import { getRepoGobletDir } from '@gobletqa/shared/utils/getRepoGobletDir'

/**
 * Gets a ref to current values of GOBLET envs
 * Then overwrites them with the passed in config || repos version
 * Returns a method to allow resetting the envs to their original value
 */
const setGobletEnv = (
  config:TGobletConfig,
) => {
  const orgGobletEnv = process.env.GOBLET_ENV
  const orgGobletBase = process.env.GOBLET_CONFIG_BASE
  const orgGobletRemoteKey = process.env[GBMountedRemoteKey]

  const environment = (config as TRepo)?.environment
  if(environment && process.env.GOBLET_ENV !== environment)
    process.env.GOBLET_ENV = environment

  const { repoRoot } = (config as TRepo)?.paths || noOpObj as TRepoPaths
  if(repoRoot)
    process.env.GOBLET_CONFIG_BASE = repoRoot

  const { remote } = (config as TRepo)?.git || noOpObj as TGitData
  if(remote) process.env[GBMountedRemoteKey] = remote

  return () => {
    if(orgGobletEnv) process.env.GOBLET_ENV = orgGobletEnv
    if(orgGobletBase) process.env.GOBLET_CONFIG_BASE = orgGobletBase
    if(orgGobletRemoteKey) process.env[GBMountedRemoteKey] = orgGobletRemoteKey
  }

}

/**
 * Loads the mounted repos world file based on the passed in config
 * If config.paths.world is not defined, search's for the world file in the config.paths.workDir
 */
const loadClientWorld = (
  config:TGobletConfig,
) => {
  const worldPath = config?.paths?.world
  if(!worldPath) return deepMerge<TWorldConfig>(DefWorld)

  const resetEnvs = setGobletEnv(config)

  let worldJson:TWorldConfig
  try {

    const basePath = getRepoGobletDir(config)

    worldJson = loaderSearch({
      basePath,
      clearCache: true,
      file: `world.json`,
      location: worldPath
    })

  }
  catch(err){
    console.log(err)
  }
  finally {
    resetEnvs()
  }

  return deepMerge(DefWorld, worldJson)
}

/**
 * Loads the clients world based on defined path or via search
 *
 * @return {Object?} - the client's world object, or undefined if it does not exist
 */
export const getClientWorld = (
  repo?:TGobletConfig,
) => {
  const cfg = repo || getGobletConfig()

  return loadClientWorld(cfg)
}

