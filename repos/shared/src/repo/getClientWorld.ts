import type { Repo } from '../repo'
import type { TGobletConfig } from '../types'

import path from 'path'
import glob from 'glob'
import { noOpObj } from '@keg-hub/jsutils'
import { getGobletConfig } from '@GSH/utils/getGobletConfig'
import { getPathFromConfig } from '@GSH/utils/getPathFromConfig'
import { tryRequireSync, deepMerge } from '@keg-hub/jsutils/src/node'

/**
 * Gets a ref to current values of GOBLET envs
 * Then overwrites them with the passed in config || repos version
 * Returns a method to allow resetting the envs to their original value
 */
const setGobletEnv = (
  config?:TGobletConfig|Repo|Record<string, any>,
  repo?:Repo,
) => {
  const orgGobletEnv = process.env.GOBLET_ENV
  const orgGobletBase = process.env.GOBLET_CONFIG_BASE

  const environment = (config as Repo)?.environment || repo?.environment
  if(environment && process.env.GOBLET_ENV !== environment)
    process.env.GOBLET_ENV = repo.environment
  
  const { repoRoot } = (config as Repo)?.paths || repo?.paths || noOpObj as Record<string, string>
  if(repoRoot)
    process.env.GOBLET_CONFIG_BASE = repoRoot

  return () => {
    process.env.GOBLET_ENV = orgGobletEnv
    process.env.GOBLET_CONFIG_BASE = orgGobletBase
  }
  
}

/**
 * Searches the client's support directory for a world export
 *
 * @return {Object?} - the client's world object, or undefined if it does not exist
 */
const searchWorld = (config?:Record<string, any>) => {
  config = config || getGobletConfig()
  const { repoRoot, workDir } = config.paths
  const baseDir = workDir ? path.join(repoRoot, workDir) : repoRoot

  // TODO: update this to allow world.json | world.ts | world.js | world/index.*
  // Should use the world path from the config
  const worldPattern = path.join(baseDir, '**/world.js')

  return glob
    .sync(worldPattern)
    .reduce((found, file) => found || tryRequireSync(file), false)
}

/**
 * Not a great solution for loading repos by setting global ENVs, then resetting them after load
 * Uses a try / catch / finally to ensure the ENVs are always reset
 * I'm sure there's a better option but this works for now
 * Should be cleaned up as some point
 */
const loadClientWorld = (
  config?:TGobletConfig|Repo|Record<string, any>,
  repo?:Repo,
) => {
  config = config || getGobletConfig()
  const worldPath = getPathFromConfig(`world`, config)

  const resetEnvs = setGobletEnv(config, repo)
  let clientExport
  try {
    clientExport = tryRequireSync(worldPath) || searchWorld(config)
  }
  catch(err){
    console.error(err)
  }
  finally {
    resetEnvs()
  }

  return clientExport
}

/**
 * Loads the clients world based on defined path or via search
 *
 * @return {Object?} - the client's world object, or undefined if it does not exist
 */
export const getClientWorld = (
  config?:TGobletConfig|Repo|Record<string, any>,
  repo?:Repo
) => {
  const clientExport = loadClientWorld(config, repo)
  return deepMerge(
    (config as Repo).world,
    clientExport && clientExport.world || clientExport
  )
}

