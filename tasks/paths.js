const os = require('os')
const path = require('path')
const { getRepoPaths } = require('./utils/repos/getRepoPaths')
const appRoot = path.join(__dirname, '..')
const repos = getRepoPaths()
const homeDir = os.homedir()

module.exports = {
  appRoot,
  homeDir,
  ...repos,
  repos: Object.values(repos),
  configsDir: path.join(appRoot, `configs`),
  scriptsDir: path.join(appRoot, `scripts`),
  containerDir: path.join(appRoot, `container`),
}
