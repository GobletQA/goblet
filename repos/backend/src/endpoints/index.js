const authApi = require('./auth')
const rootApi = require('./root')
const repoApi = require('./repo')

module.exports = (...args) => {
  authApi(...args)
  repoApi(...args)
  rootApi(...args)
}
