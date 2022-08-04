process.env.PARSE_CONFIG_PATH = `configs/tasks.config.js`
const { runTask } = require('@keg-hub/cli-utils')
runTask(require('./index'), { env: process.env.NODE_ENV || 'local' })
