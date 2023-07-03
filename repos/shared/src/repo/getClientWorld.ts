import type { Repo } from '@GSH/repo'
import type { TWorldConfig } from '@ltipton/parkin'
import type { TGitData, TRepoPaths, TGobletConfig } from '@GSH/types'

import { loaderSearch } from '@GSH/libs/loader'
import { DefWorld, GBMountedRemoteKey } from '@GSH/constants'
import { getGobletConfig } from '@GSH/goblet/getGobletConfig'
import { getRepoGobletDir } from '@GSH/utils/getRepoGobletDir'
import { noOpObj, deepMerge } from '@keg-hub/jsutils/src/node'

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

  const environment = (config as Repo)?.environment
  if(environment && process.env.GOBLET_ENV !== environment)
    process.env.GOBLET_ENV = environment

  const { repoRoot } = (config as Repo)?.paths || noOpObj as TRepoPaths
  if(repoRoot)
    process.env.GOBLET_CONFIG_BASE = repoRoot

  const { remote } = (config as Repo)?.git || noOpObj as TGitData
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
  return loadClientWorld(repo || getGobletConfig())
}

