const path = require('path')
const { isMainThread } = require('worker_threads')

;(async () => {
  if (isMainThread) return

  require('esbuild-register/dist/node').register({})
  require(path.resolve(__dirname, `./workerPipeline.ts`))

})()
