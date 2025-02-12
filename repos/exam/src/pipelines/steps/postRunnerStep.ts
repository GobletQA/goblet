import type {
  TExRunResult,
  TStateManager,
  TPipelineArgs,
} from '@GEX/types'

import { isArr } from '@keg-hub/jsutils/isArr'
import { loadFilesTask } from '../tasks/loadFilesTask'
import { buildExamFinishedEvt } from '@GEX/utils/buildResult'

export const postRunnerStep = async (args:TPipelineArgs, manager?:TStateManager) => {
  const { config } = args

  isArr(config.postRunner)
    && config.postRunner?.length
    && await loadFilesTask(args, config.postRunner)

  const { EventReporter, TestResults } = manager.getState()

  EventReporter?.event?.(buildExamFinishedEvt(config, TestResults as TExRunResult[]))

}
