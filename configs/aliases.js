require('./aliases.config').registerAliases()
require('esbuild-register/dist/node').register({
  format: `cjs`,
  hookIgnoreNodeModules: false
})

