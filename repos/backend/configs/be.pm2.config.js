require('../resolveRoot')
const path = require('path')
const { aliases } = require('@GConfigs/aliases.config')

/** Path to the logs directory */
const logDir = aliases[`@GLogs`]
const beRoot = aliases[`@GBE/Root`]


module.exports = {
  apps: [
    {
      cwd: beRoot,
      args: 'start',
      script: 'yarn',
      name: `backend`,
      interpreter: '/bin/bash',
      out_file: path.join(logDir, `backend.out.log`),
      error_file: path.join(logDir, `backend.err.log`),
    }
  ]
}
