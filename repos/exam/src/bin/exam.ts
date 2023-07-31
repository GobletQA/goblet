import "@GEX/utils/logger"

import { getConfig } from './getConfig'
import { initLocal } from './initLocal'
import { runWorkers } from './runWorkers'
import { updateCLIEnvs } from './helpers'
import { initWorkers } from './initWorkers'
import { printDebugResults } from '@GEX/debug'
import { ife, timedRun } from '@keg-hub/jsutils'
import { removeEmpty, parseArgs } from './helpers'

ife(async () => {

  const opts = await parseArgs()
  const exam = removeEmpty(await getConfig(opts))

  updateCLIEnvs(exam, opts)

  await initLocal(exam, opts)

  // const { WP, chunks }  = await initWorkers(exam, opts)

  // const [result, time] = await timedRun(
  //   runWorkers,
  //   WP,
  //   exam,
  //   chunks
  // )

  // printDebugResults(result, time)

})