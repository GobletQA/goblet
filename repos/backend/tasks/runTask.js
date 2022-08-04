const { setLogs } = require('@keg-hub/jsutils')
setLogs(true, `log`, `[GBK]`)
require('@keg-hub/cli-utils').runTask(require('./index'))
