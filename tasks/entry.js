require('esbuild-register/dist/node').register({
  minify: false,
  target: "es2015",
  loader: 'ts',
})

// Call this first to ensure the NODE_ENV is set to the passed in --env arg if set
require('./utils/envs/parseArgEnv').parseArgEnv()
require('./runTask')
