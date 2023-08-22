import type { TPipelineArgs } from '@GEX/types'

import { isArr } from '@keg-hub/jsutils/isArr'
import { loadFilesTask } from '../tasks/loadFilesTask'

export const postEnvironmentStep = async (args:TPipelineArgs) => {

  const { config } = args
  
  if(!isArr(config.postEnvironment) || !config.postEnvironment?.length) return

  await loadFilesTask(args, config.postEnvironment)

}
