const path = require('path')
const { ife } = require('@keg-hub/jsutils')
const { isMainThread } = require('worker_threads')

ife(async () => {
  if (isMainThread) return

  require('esbuild-register/dist/node').register({})
  require(path.resolve(__dirname, `./worker.ts`))

})
