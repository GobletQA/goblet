import { TPipelineArgs } from '@GEX/types'
import { Logger } from '@GEX/utils/logger'
import { isArr } from '@keg-hub/jsutils'
import pMapSeries from 'p-map-series'

import { runTestsTask } from '../tasks/runTestsTask'
import { loadRunnerTask } from '../tasks/loadRunnerTask'

export const runnerStep = async (args:TPipelineArgs) => {
  Logger.debug(`------- runnerStep -------`)

  const runners = await loadRunnerTask(args)
  const outcomes = await runTestsTask(args, runners)
  
  console.log(`------- outcomes -------`)
  console.log(outcomes)

  return args
}
