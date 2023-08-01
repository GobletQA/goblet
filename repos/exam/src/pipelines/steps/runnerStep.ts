import { TPipelineArgs, TStateManager } from '@GEX/types'
import { Logger } from '@GEX/utils/logger'
import { isArr } from '@keg-hub/jsutils'
import pMapSeries from 'p-map-series'

import { runTestsTask } from '../tasks/runTestsTask'
import { loadRunnerTask } from '../tasks/loadRunnerTask'

export const runnerStep = async (args:TPipelineArgs, manager?:TStateManager) => {
  Logger.debug(`------- runnerStep -------`)

  const runners = await loadRunnerTask(args)
  const outcomes = await runTestsTask(args, runners)

  manager.setValue(`TestResults`, outcomes)
  
  args.rewind.push(() => {
    runners.map(async ({ model, Runner }) => await Runner?.cleanup?.())
  })

}
