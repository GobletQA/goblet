import { TPipelineArgs } from '../types'
import { Logger } from '@GEX/utils/logger'
import { isArr } from '@keg-hub/jsutils'
import { loadFilesTask } from '../tasks/loadFilesTask'

export const preEnvironmentStep = async (args:TPipelineArgs) => {
  Logger.debug(`------- preEnvironmentStep -------`)

  const { config } = args
  if(!isArr(config.preEnvironment) || !config.preEnvironment?.length) return

  loadFilesTask(args, config.preEnvironment)


  return args
}