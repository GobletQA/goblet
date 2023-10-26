import type {
  Repo,
  TGitData,
  TRepoPaths,
  TGBWorldCfg,
  TGobletConfig,
} from '@GRP/types'

import { ENVS } from '@gobletqa/environment'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { DefWorld } from '@gobletqa/environment/constants'
import { loaderSearch, getGobletConfig, getRepoGobletDir } from '@gobletqa/goblet'

/**
 * @ **IMPORTANT** - Export for tests only
 * Gets a ref to current values of GOBLET envs
 * Then overwrites them with the passed in config || repos version
 * Returns a method to allow resetting the envs to their original value
 */
export const setGobletEnv = (
  config:TGobletConfig,
) => {
  const orgGobletEnv = ENVS.GOBLET_ENV
  const orgGobletBase = ENVS.GOBLET_CONFIG_BASE
  const orgGobletRemote = ENVS.GB_GIT_REPO_REMOTE
  const orgGobletCfgRef = ENVS.GB_REPO_CONFIG_REF

  const environment = (config as Repo)?.environment
  if(environment && ENVS.GOBLET_ENV !== environment) ENVS.GOBLET_ENV = environment

  const { repoRoot } = (config as Repo)?.paths || noOpObj as TRepoPaths
  if(repoRoot) ENVS.GOBLET_CONFIG_BASE = repoRoot

  const { remote } = (config as Repo)?.git || noOpObj as TGitData
  if(remote) ENVS.GB_GIT_REPO_REMOTE = remote
  
  const { $ref } = (config || noOpObj) as Repo
  if($ref) ENVS.GB_REPO_CONFIG_REF = $ref

  return () => {
    if(orgGobletEnv) ENVS.GOBLET_ENV = orgGobletEnv
    if(orgGobletBase) ENVS.GOBLET_CONFIG_BASE = orgGobletBase
    if(orgGobletRemote) ENVS.GB_GIT_REPO_REMOTE = orgGobletRemote
    if(orgGobletCfgRef) ENVS.GB_REPO_CONFIG_REF = orgGobletCfgRef
  }

}

/**
 * @ **IMPORTANT** - Export for tests only
 * Loads the mounted repos world file based on the passed in config
 * If config.paths.world is not defined, search's for the world file in the config.paths.workDir
 */
export const loadClientWorld = (
  config:TGobletConfig,
) => {
  const worldPath = config?.paths?.world
  if(!worldPath) return deepMerge<TGBWorldCfg>(DefWorld)

  const resetEnvs = setGobletEnv(config)

  let worldJson:TGBWorldCfg
  try {

    const basePath = getRepoGobletDir(config)

    worldJson = loaderSearch({
      basePath,
      clearCache: true,
      file: `world.json`,
      location: worldPath
    }) as TGBWorldCfg

  }
  catch(err){
    console.warn(`[Load Client World] - Error loading world file`)
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
):TGBWorldCfg => {
  const cfg = repo || getGobletConfig()
  return loadClientWorld(cfg)
}

