
require('esbuild-register/dist/node').register({
  minify: false,
  target: "es2015",
  loader: 'tsx',
})

require('./runTask')
