import type { TWorldConfig } from '@ltipton/parkin'
import type { TGitData, TRepoPaths, TGobletConfig, TRepo } from '@GWF/types'

import { DefWorld } from '../constants'
import { ENVS } from '@gobletqa/environment'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { loaderSearch } from '@gobletqa/shared/libs/loader'
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
  const orgGobletEnv = ENVS.GOBLET_ENV
  const orgGobletBase = ENVS.GOBLET_CONFIG_BASE
  const orgGobletRemote = ENVS.GB_GIT_REPO_REMOTE

  const environment = (config as TRepo)?.environment
  if(environment && ENVS.GOBLET_ENV !== environment)
    ENVS.GOBLET_ENV = environment

  const { repoRoot } = (config as TRepo)?.paths || noOpObj as TRepoPaths
  if(repoRoot)
    ENVS.GOBLET_CONFIG_BASE = repoRoot

  const { remote } = (config as TRepo)?.git || noOpObj as TGitData
  if(remote) ENVS.GB_GIT_REPO_REMOTE = remote

  return () => {
    if(orgGobletEnv) ENVS.GOBLET_ENV = orgGobletEnv
    if(orgGobletBase) ENVS.GOBLET_CONFIG_BASE = orgGobletBase
    if(orgGobletRemote) ENVS.GB_GIT_REPO_REMOTE = orgGobletRemote
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
    }) as TWorldConfig

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

