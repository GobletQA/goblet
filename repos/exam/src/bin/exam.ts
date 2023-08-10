import "./init"
import "@GEX/utils/logger"
import { isArr } from '@keg-hub/jsutils/isArr'
// @ts-ignore
import { ife } from '@keg-hub/jsutils/ife'

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

  const [results, time] = exam?.runInBand
    ? await initLocal(exam, opts)
    : await initWorkers(exam, opts)

  printDebugResults(results, time)

  if(!isArr(results)) process.exit(1)

  results?.length
    ? results.forEach(result => result.failed && process.exit(1))
    : !exam.passWithNoTests && process.exit(1)

})
