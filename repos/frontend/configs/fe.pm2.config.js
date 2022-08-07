require('../resolveRoot')
const path = require('path')
const { aliases } = require('@GConfigs/aliases.config')

const logDir = aliases[`@GLogs`]
const feRoot = aliases[`@GFERoot`]

module.exports = {
  apps: [
    {
      cwd: feRoot,
      args: 'start',
      script: 'yarn',
      name: `frontend`,
      interpreter: '/bin/bash',
      out_file: path.join(logDir, `frontend.out`),
      error_file: path.join(logDir, `frontend.err`),
    }
  ]
}
