import "./init"
import "@GEX/utils/logger"
import { ife } from '@keg-hub/jsutils'
import { getConfig } from './getConfig'
import { initLocal } from './initLocal'
import { updateCLIEnvs } from './helpers'
import { initWorkers } from './initWorkers'
import { printDebugResults } from '@GEX/debug'
import { removeEmpty, parseArgs } from './helpers'


ife(async () => {

  const opts = await parseArgs()
  const config = await getConfig(opts)

  const exam = removeEmpty(config)
  updateCLIEnvs(exam, opts)

  const [result, time] = exam?.runInBand
    ? await initLocal(exam, opts)
    : await initWorkers(exam, opts)

  printDebugResults(result, time)

})
