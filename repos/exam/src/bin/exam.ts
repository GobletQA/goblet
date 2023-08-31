import "./init"
import "@GEX/utils/logger"
import { getConfig } from './getConfig'
import { initLocal } from './initLocal'
import { updateCLIEnvs } from './helpers'
import { ife } from '@keg-hub/jsutils/ife'
import { initWorkers } from './initWorkers'
import { isArr } from '@keg-hub/jsutils/isArr'
import { printDebugResults } from '@GEX/debug'
import { removeEmpty, parseArgs } from './helpers'

ife(async () => {

  const opts = await parseArgs()
  const config = await getConfig(opts)
  const exam = removeEmpty(config)

  updateCLIEnvs(exam, opts)

  const [results, time] = exam?.runInBand
    ? await initLocal(exam, opts)
    : await initWorkers(exam, opts)

  printDebugResults(results, time)

  if(!isArr(results)) process.exit(1)

  results?.length
    ? results.forEach(result => result.failed && (process.exitCode = 1))
    : !exam.passWithNoTests && (process.exitCode = 1)

})
