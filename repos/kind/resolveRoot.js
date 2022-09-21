require('source-map-support').install({ environment: 'node' })
require('../../configs/aliases.config').registerAliases()

/**
 * Will be needed when the package is bundled
 * Still needs to be figured out
 * So for now just return __dirname
 */
const resolveRoot = () => {
  return __dirname
}

module.exports = {
  GBKRoot: resolveRoot()
}