import { TPipelineArgs, TStateManager } from '../types'
import { setupTask } from '../tasks/setupTask'
import { createRequireTask } from '../tasks/createRequireTask'
import { Logger } from '@GEX/utils/logger'

export const setupPipeStep = async (args:TPipelineArgs, manager?:TStateManager) => {
  Logger.debug(`------- setupPipeStep -------`)
  const {
    passthrough
  } = setupTask(args, manager)

  const pRequire = createRequireTask(args)

  manager.setValue(`require`, pRequire)
  manager.setValue(`passthrough`, passthrough)
  


}