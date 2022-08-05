const { setLogs } = require('@keg-hub/jsutils')
const { runTask } = require('@keg-hub/cli-utils')
require('./utils/helpers/contexts').setContexts(require('../configs/tasks.config').appContexts)

process.env.PARSE_CONFIG_PATH = `configs/tasks.config.js`
process.env.TASKS_DEBUG && setLogs(true, `log`, `[Goblet]`)

runTask(require('./index'), { env: process.env.NODE_ENV || 'local' })
