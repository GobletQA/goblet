const os = require('os')
const path = require('path')
const { GobletRoot } = require('../gobletRoot')
const { getRepoPaths } = require('./utils/helpers/getRepoPaths')

const homeDir = os.homedir()
const reposDir = path.join(GobletRoot, `repos`) 

module.exports = {
  homeDir,
  reposDir,
  appRoot: GobletRoot,
  repos: getRepoPaths(reposDir),
  distDir: path.join(GobletRoot, `dist/app`),
  scriptsDir: path.join(GobletRoot, `scripts`),
  containerDir: path.join(GobletRoot, './container'),
  testUtilsDir: path.join(GobletRoot, `repos/testUtils`),
  coreBuildDir: path.join(GobletRoot, `node_modules/keg-core/web-build`),
}
