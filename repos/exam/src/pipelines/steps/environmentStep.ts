import { TExecPassThroughOpts } from '@GEX/types'
import { TPipelineArgs, TStateManager } from '@GEX/types'

import { Logger } from '@GEX/utils/logger'
import { loadEnvironmentTask } from '../tasks/loadEnvironmentTask'
import { ExamEnvironment } from '@GEX/environment/ExamEnvironment'



export const environmentStep = async (args:TPipelineArgs, manager?:TStateManager) => {
  Logger.debug(`------- environmentStep -------`)

  const { state } = args
  const { environment } = state.passthrough as TExecPassThroughOpts
  const examEnv = new ExamEnvironment(environment)
  manager.setValue(`ExamEnvironment`, examEnv)
  const baseEnv = await loadEnvironmentTask(args)
  manager.setValue(`BaseEnvironment`, baseEnv)

  args.reverse.push(() => {
    examEnv?.reset?.()
    baseEnv?.reset?.()
  })

  return args
}