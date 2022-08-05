const path  = require('path')
const { repos } = require('../../paths')
const { loadEnvs } = require(path.join(repos.shared, 'src/utils/loadEnvs'))

module.exports = {
  loadEnvs,
}
