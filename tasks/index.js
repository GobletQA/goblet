// Call this first to ensure the NODE_ENV is set to the passed in --env arg if set
require('./utils/envs/parseArgEnv').parseArgEnv()

require('../configs/aliases.config').registerAliases()

// Ensure the shared options are set
require('./utils/task/sharedOptions')

/**
 * Set the repos root path within the cli-utils
 * Ensure child processes run from the cli-utils use the repos folder as the root directory
 * This generally only needed when task are called form the keg-cli and not yarn
 */
const { appRoot } = require('./paths')
const { setAppRoot } = require('@keg-hub/cli-utils')
setAppRoot(appRoot)

module.exports = require('./definitions')
