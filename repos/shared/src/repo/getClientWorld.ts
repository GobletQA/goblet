import path from 'path'
import glob from 'glob'
import { getGobletConfig } from '@GSH/utils/getGobletConfig'
import { getPathFromConfig } from '@GSH/utils/getPathFromConfig'
import { tryRequireSync, deepMerge, noOpObj } from '@keg-hub/jsutils/src/node'

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
 * Loads the clients world based on defined path or via search
 *
 * @return {Object?} - the client's world object, or undefined if it does not exist
 */
export const getClientWorld = (config?:Record<string, any>) => {
  config = config || getGobletConfig()
  const worldPath = getPathFromConfig(`world`, config)
  const clientExport = tryRequireSync(worldPath) || searchWorld(config)

  return deepMerge(config.world, clientExport && clientExport.world || clientExport)
}

