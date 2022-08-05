const path = require('path')
const glob = require('glob')
const { getGobletConfig } = require('@GSH/Utils/getGobletConfig')
const { tryRequireSync, deepMerge } = require('@keg-hub/jsutils/src/node')

/**
 * Searches the client's support directory for a world export
 *
 * @return {Object?} - the client's world object, or undefined if it does not exist
 */
const getClientWorld = (config) => {
  config = config || getGobletConfig()
  const { repoRoot, supportDir, workDir } = config.paths
  const baseDir = workDir ? path.join(repoRoot, workDir) : repoRoot
  // TODO: update this to allow world.json | world.ts | world.js | world/index.*
  // Should use the world path from the config
  const worldPattern = path.join(baseDir, '**/world.js')

  const clientExport = glob
    .sync(worldPattern)
    .reduce((found, file) => found || tryRequireSync(file), false)

  return deepMerge(config.world, clientExport && clientExport.world)
}

module.exports = { getClientWorld }
