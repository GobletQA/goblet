const path = require('path')
const glob = require('glob')
const { getGobletConfig } = require('@GSH/utils/getGobletConfig')
const { tryRequireSync, deepMerge, noOpObj } = require('@keg-hub/jsutils/src/node')

// TODO: figure out better way to load world, only use world path from config???

/**
 * Searches the client's support directory for a world export
 *
 * @return {Object?} - the client's world object, or undefined if it does not exist
 */
const getClientWorld = (config) => {
  config = config || getGobletConfig()

  const { repoRoot, workDir, world } = config.paths
  const baseDir = workDir ? path.join(repoRoot, workDir) : repoRoot
  
  let clientExport = noOpObj
  
  if(world){
    clientExport = tryRequireSync(path.join(baseDir, world))
  }
  else {
    // TODO: update this to allow world.json | world.ts | world.js | world/index.*
    // Should use the world path from the config
    const worldPattern = path.join(baseDir, '**/world.js')

    clientExport = glob
      .sync(worldPattern)
      .reduce((found, file) => found || tryRequireSync(file), false)
  }

  return deepMerge(config.world, clientExport && clientExport.world || clientExport)
}

module.exports = { getClientWorld }
