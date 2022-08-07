require('../resolveRoot')
const path = require('path')
const { aliases } = require('@GConfigs/aliases.config')

const logDir = aliases[`@GLogs`]
const scRoot = aliases[`@GSCRoot`]

module.exports = {
  apps : [
    {
      cwd: scRoot,
      script: 'yarn',
      args: 'start',
      name: `screencast`,
      interpreter: '/bin/bash',
      out_file: path.join(logDir, `screencast.out`),
      error_file: path.join(logDir, `screencast.err`),
    },
  ]
}
