process.env.PARSE_CONFIG_PATH = `configs/tasks.config.js`
const { apps } = require('../configs/tasks.config')

require('./utils/helpers/contexts').setContexts(apps)

process.env.TASKS_DEBUG
  && require('@keg-hub/jsutils').setLogs(true, `log`, `[Goblet]`)

require('@keg-hub/cli-utils').runTask(require('./index'), {
  env: process.env.NODE_ENV || 'local',
})
