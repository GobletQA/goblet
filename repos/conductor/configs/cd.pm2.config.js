require('../resolveRoot')
const path = require('path')
const { aliases } = require('@GConfigs/aliases.config')

const logDir = aliases[`@GLogs`]
const scRoot = aliases[`@GSCRoot`]

module.exports = {
  apps : [
    {
      cwd: scRoot,
      script: 'pnpm',
      args: 'start',
      name: `conductor`,
      interpreter: '/bin/bash',
      out_file: path.join(logDir, `conductor.out.log`),
      error_file: path.join(logDir, `conductor.err.log`),
    },
  ]
}
