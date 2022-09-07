/**
 * Will eventually be the entry point for goblet tests
 * This allows them to follow a different path to execute tests than normal tasks
 * Which does not load all tasks, only those needed to run goblet tests
 */

require('../configs/aliases.config').registerAliases()

process.env.PARSE_CONFIG_PATH = `configs/tasks.config.js`
const { apps } = require('../configs/tasks.config')
require('./utils/helpers/contexts').setContexts(apps)

process.env.TASKS_DEBUG
  && require('@keg-hub/jsutils').setLogs(true, `log`, `[Goblet]`)

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

require('@keg-hub/cli-utils').runTask(require('./definitions/goblet'), {
  env: process.env.NODE_ENV || 'test',
})


