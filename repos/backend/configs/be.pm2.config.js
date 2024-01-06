require('../resolveRoot')
const path = require('path')
const { aliases } = require('@gobletqa/configs/aliases.config')

const beRoot = aliases[`@GBE/Root`]
const logDir = path.join(aliases.GobletRoot, `logs`)

module.exports = {
  apps: [
    {
      cwd: beRoot,
      args: 'start',
      script: 'pnpm',
      name: `backend`,
      interpreter: '/bin/bash',
      out_file: path.join(logDir, `backend.out.log`),
      error_file: path.join(logDir, `backend.err.log`),
    }
  ]
}
