import type { TPipelineArgs } from '@GEX/types'
import { isArr } from '@keg-hub/jsutils'
import { loadFilesTask } from '../tasks/loadFilesTask'

export const postRunnerStep = async (args:TPipelineArgs) => {

  const { config } = args
  if(!isArr(config.postRunner) || !config.postRunner?.length) return

  loadFilesTask(args, config.postRunner)

}
