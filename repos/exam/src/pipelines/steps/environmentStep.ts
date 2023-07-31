import { TPipelineArgs, TStateManager } from '../types'
import { Logger } from '@GEX/utils/logger'
import { isArr } from '@keg-hub/jsutils'
import { loadFilesTask } from '../tasks/loadFilesTask'
import { loadEnvironmentTask } from '../tasks/loadEnvironmentTask'
import { ExamEnvironment } from '@GEX/environment/ExamEnvironment'
import {TExecPassThroughOpts} from '@GEX/types'



export const environmentStep = async (args:TPipelineArgs, manager?:TStateManager) => {
  const { state } = args
  const { environment } = state.passthrough as TExecPassThroughOpts
  const examEnv = new ExamEnvironment(environment)
  manager.setValue(`ExamEnvironment`, examEnv)

  return args
}