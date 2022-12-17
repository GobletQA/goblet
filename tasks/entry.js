process.env.PARSE_CONFIG_PATH = `configs/tasks.config.js`

require('esbuild-register/dist/node').register({
  minify: false,
  target: "es2015",
  loader: 'ts',
})

require('./utils/envs/parseArgEnv').parseArgEnv()
require('./runTask')
