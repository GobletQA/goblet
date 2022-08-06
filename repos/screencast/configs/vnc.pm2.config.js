require('../resolveRoot')
const path = require('path')
const { aliases } = require('@GConfigs/aliases.config')

/** Path to the logs directory */
const logDir = aliases[`@GLogs`]
const scRoot = aliases[`@GSCRoot`]

module.exports = {
  apps : [
    {
      args: 'vnc',
      name: `TigerVnc`,
      out_file: path.join(logDir, `vnc.out`),
      error_file: path.join(logDir, `vnc.err`),
      script : path.join(scRoot, `dist/vnc.js`),
    },
    {
      args: 'sock',
      name: `WebSockify`,
      out_file: path.join(logDir, `sockify.out`),
      error_file: path.join(logDir, `sockify.err`),
      script : path.join(scRoot, `dist/vnc.js`),
    }
  ]
}