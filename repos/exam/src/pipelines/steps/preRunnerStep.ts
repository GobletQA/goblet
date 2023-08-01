import type { TExecRunners, TPipelineArgs, TStateManager } from '@GEX/types'

import { exists, isArr } from '@keg-hub/jsutils'
import { loadFilesTask } from '../tasks/loadFilesTask'

export const preRunnerStep = async (args:TPipelineArgs, manager?:TStateManager) => {

  const { config } = args
  if(isArr(config.preRunner) && !config.preRunner?.length)
    await loadFilesTask(args, config.preRunner)

  if(!exists(config.runners)) return args

  const runners = await loadFilesTask<Record<string, TExecRunners>>(args, config.runners)
  manager.setValue(`RunnerClasses`, runners)

}
