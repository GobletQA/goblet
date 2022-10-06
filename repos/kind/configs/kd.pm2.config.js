require('../resolveRoot')
const path = require('path')
const { aliases } = require('@GConfigs/aliases.config')

/** Path to the logs directory */
const logDir = aliases[`@GLogs`]
const kdRoot = aliases[`@GKD/Root`]

module.exports = {
  apps: [
    {
      cwd: kdRoot,
      args: 'start',
      script: 'yarn',
      name: `kind`,
      interpreter: '/bin/bash',
      out_file: path.join(logDir, `kind.out.log`),
      error_file: path.join(logDir, `kind.err.log`),
    }
  ]
}
