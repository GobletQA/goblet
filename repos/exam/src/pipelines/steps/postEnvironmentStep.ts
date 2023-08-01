import { TPipelineArgs } from '@GEX/types'
import { Logger } from '@GEX/utils/logger'
import { isArr } from '@keg-hub/jsutils'
import { loadFilesTask } from '../tasks/loadFilesTask'

export const postEnvironmentStep = async (args:TPipelineArgs) => {
  Logger.debug(`------- postEnvironmentStep -------`)

  const { config } = args
  
  if(!isArr(config.postEnvironment) || !config.postEnvironment?.length) return

  loadFilesTask(args, config.postEnvironment)

}