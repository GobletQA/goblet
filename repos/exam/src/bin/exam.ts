import "@GEX/utils/logger"

import { getConfig } from './getConfig'
import { initWorkers } from './initWorkers'
import { printDebugResults } from '@GEX/debug'
import { ife, timedRun } from '@keg-hub/jsutils'
import { removeEmpty, parseArgs } from './helpers'
import { updateCLIEnvs } from './helpers'

ife(async () => {

  const opts = await parseArgs()
  const exam = removeEmpty(getConfig(opts))

  updateCLIEnvs(exam, opts)

  const [result, time] = await timedRun(initWorkers, exam, opts)

  printDebugResults(result, time)

})