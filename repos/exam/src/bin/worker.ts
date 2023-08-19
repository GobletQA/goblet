/**
 * This file is a copy of the workere.js but used in th actual bundle
 * Because we can't require .ts files, so we are stuck with a duplicate file
 * One for running in dev, and the other for running in the exam bundled code
 */

const path = require('path')
const { isMainThread } = require('worker_threads')

;(async () => {
  if (isMainThread) return

  require('esbuild-register/dist/node').register({})
  require(path.resolve(__dirname, `./workerPipeline.js`))

})()
