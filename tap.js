const { registerAliases, aliases } = require('./configs/aliases.config')
registerAliases()

module.exports = require('./repos/frontend/configs/frontend.config')(aliases)
