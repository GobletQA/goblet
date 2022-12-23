
import type { Repo } from '../repo'
import type { TGobletConfig } from '../types'

import path from 'path'
import glob from 'glob'
import { getGobletConfig } from '@GSH/goblet'
import { tryRequireSync } from '@keg-hub/jsutils/src/node'

/**
 * Searches the client's support directory for a world export
 *
 * @return {Object?} - the client's world object, or undefined if it does not exist
 */
export const searchWorld = (config?:TGobletConfig) => {
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


export const searchWorldFiles = () => {
  
}