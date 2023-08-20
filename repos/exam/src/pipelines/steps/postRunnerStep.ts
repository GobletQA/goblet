import type { TPipelineArgs } from '@GEX/types'

import { isArr } from '@keg-hub/jsutils/isArr'
import { loadFilesTask } from '../tasks/loadFilesTask'

export const postRunnerStep = async (args:TPipelineArgs) => {

  const { config } = args
  if(!isArr(config.postRunner) || !config.postRunner?.length) return

  await loadFilesTask(args, config.postRunner)

}
