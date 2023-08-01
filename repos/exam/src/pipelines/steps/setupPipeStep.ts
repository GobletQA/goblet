import type { TPipelineArgs, TStateManager } from '@GEX/types'

import { setupTask } from '../tasks/setupTask'
import { createRequireTask } from '../tasks/createRequireTask'
import {
  argsState,
  stateManager,
  responseState,
} from '../states/pipelineStates'

export const setupPipeStep = async (args:TPipelineArgs, manager?:TStateManager) => {

  const {
    passthrough
  } = setupTask(args, manager)

  const pRequire = createRequireTask(args)

  manager.setValue(`require`, pRequire)
  manager.setValue(`passthrough`, passthrough)

  args.rewind.push(() => {
    argsState.cleanup()
    stateManager.cleanup()
    responseState.cleanup()
  })

}