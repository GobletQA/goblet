const os = require('os')
const path = require('path')
const { GobletRoot } = require('../gobletRoot')
const { getRepoPaths } = require('./utils/helpers/getRepoPaths')
const repos = getRepoPaths()
const homeDir = os.homedir()

module.exports = {
  homeDir,
  appRoot: GobletRoot,
  distDir: path.join(GobletRoot, `dist/tap`),
  scriptsDir: path.join(appRoot, `scripts`),
  containerDir: path.join(GobletRoot, './container'),
  testUtilsDir: path.join(GobletRoot, `repos/testUtils`),
  coreBuildDir: path.join(GobletRoot, `node_modules/keg-core/web-build`),
  reposDir: path.join(GobletRoot, `repos`),
  repos: Object.values(repos),
  ...repos,
}
