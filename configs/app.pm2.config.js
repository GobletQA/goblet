const { register } = require('esbuild-register/dist/node')
register()

const fs = require('fs')
const path = require('path')
const { aliases } = require('./aliases.config')


const logDir = path.join(aliases.GobletRoot, `logs`)

/** Ensure the logs directory exists */
!fs.existsSync(logDir) && fs.mkdirSync(logDir)

const beConfdir = aliases[`@GBE/Configs`]
const scConfdir = aliases[`@GSC/Configs`]
const feConfdir = aliases[`@GFE/Configs`]

const bePM2Conf = require(path.join(beConfdir, 'be.pm2.config.js'))
const fePM2Conf = require(path.join(feConfdir, 'fe.pm2.config.js'))
const scPM2Conf = require(path.join(scConfdir, 'sc.pm2.config.js'))
const vncPM2Conf = require(path.join(scConfdir, 'vnc.pm2.config.js'))

module.exports = {
  apps : [
    // ...scPM2Conf.apps,
    ...bePM2Conf.apps,
    ...vncPM2Conf.apps,
    ...fePM2Conf.apps,
  ]
}
