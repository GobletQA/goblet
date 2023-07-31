import { TPipelineArgs } from '@GEX/types'
import { Logger } from '@GEX/utils/logger'
import { isArr } from '@keg-hub/jsutils'
import { loadFilesTask } from '../tasks/loadFilesTask'

export const postRunnerStep = async (args:TPipelineArgs) => {
  Logger.debug(`------- postRunner -------`)

  const { config } = args
  if(!isArr(config.postRunner) || !config.postRunner?.length) return

  loadFilesTask(args, config.postRunner)

  return args
}
