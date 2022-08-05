const fs = require('fs')
const path = require('path')
const { aliases } = require('./aliases.config')

/** Path to the logs directory */
const logDir = aliases[`@GLogs`]
/** Ensure the logs directory exists */
!fs.existsSync(logDir) && fs.mkdirSync(logDir)


const tapConfdir = aliases[`@GTapRoot/Configs`]
const tapPM2Conf = require(path.join(tapConfdir, `pm2.tap.config.js`))

module.exports = {
  apps : [
    ...scPM2Conf.apps,
    ...vncPM2Conf.apps,
    ...tapPM2Conf.apps,
  ]
}
