
require('esbuild-register/dist/node').register({
  minify: false,
  target: "es2015",
  loader: 'ts',
})

module.exports = require('./index.ts')

 
