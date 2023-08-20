import type { TPipelineArgs } from '@GEX/types'

import { isArr } from '@keg-hub/jsutils/isArr'
import { loadFilesTask } from '../tasks/loadFilesTask'
import { createRequireTask } from '../tasks/createRequireTask'

export const onShutdownStep = async (args:Omit<TPipelineArgs, `rewind`|`state`>) => {
  const { config } = args
  
  if(!isArr(config.onShutdown) || !config.onShutdown?.length) return

  const pRequire = createRequireTask(args)

  await loadFilesTask({
    ...args,
    state: { require: pRequire },
  }, config.onShutdown)

}
