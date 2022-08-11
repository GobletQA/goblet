process.env.PARSE_CONFIG_PATH = `configs/tasks.config.js`
const { tasks } = require('../configs/tasks.config')

require('./utils/helpers/contexts').setContexts(tasks.appContexts, tasks.prefix)

process.env.TASKS_DEBUG
  && require('@keg-hub/jsutils').setLogs(true, `log`, `[Goblet]`)

require('@keg-hub/cli-utils').runTask(require('./index'), {
  env: process.env.NODE_ENV || 'local',
})
