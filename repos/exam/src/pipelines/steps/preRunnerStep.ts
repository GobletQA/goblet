import { TPipelineArgs, TStateManager } from '@GEX/types'
import { Logger } from '@GEX/utils/logger'
import { exists, isArr } from '@keg-hub/jsutils'
import { loadFilesTask } from '../tasks/loadFilesTask'

export const preRunnerStep = async (args:TPipelineArgs, manager?:TStateManager) => {
  Logger.debug(`------- preRunner -------`)

  const { config } = args
  if(isArr(config.preRunner) && !config.preRunner?.length)
    await loadFilesTask(args, config.preRunner)

  if(!exists(config.runners)) return args

  const runners = await loadFilesTask(args, config.runners) as any
  manager.setValue(`RunnerClasses`, runners)

  return args
}
