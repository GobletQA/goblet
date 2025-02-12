import type { TPipelineArgs } from '@GEX/types'

import { isArr } from '@keg-hub/jsutils/isArr'
import { loadFilesTask } from '../tasks/loadFilesTask'

export const preEnvironmentStep = async (args:TPipelineArgs) => {
  const { config } = args
  if(!isArr(config.preEnvironment) || !config.preEnvironment?.length) return

  await loadFilesTask(args, config.preEnvironment)

}