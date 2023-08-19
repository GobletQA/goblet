import type { TExecPassThroughOpts, TPipelineArgs, TStateManager } from '@GEX/types'

import { loadEnvironmentTask } from '../tasks/loadEnvironmentTask'
import { ExamEnvironment } from '@GEX/environment/ExamEnvironment'

export const environmentStep = async (args:TPipelineArgs, manager?:TStateManager) => {

  const { state } = args
  const { environment } = state.passthrough as TExecPassThroughOpts
  const examEnv = new ExamEnvironment(environment)
  manager.setValue(`ExamEnvironment`, examEnv)
  const baseEnv = await loadEnvironmentTask(args)
  manager.setValue(`BaseEnvironment`, baseEnv)

  args.rewind.push(() => {
    examEnv?.reset?.()
    baseEnv?.reset?.()
  })

}