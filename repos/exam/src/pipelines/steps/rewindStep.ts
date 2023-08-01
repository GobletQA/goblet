import { TPipelineArgs, TStateManager } from '@GEX/types'
import { UnaryFunction } from 'p-pipe'

import pPipe from 'p-pipe'
import { isArr } from '@keg-hub/jsutils'
import { Logger } from '@GEX/utils/logger'

export const rewindStep = async (args:TPipelineArgs, manager?:TStateManager) => {
  Logger.debug(`------- rewindStep -------`)
  
  const { rewind } = args
  const state = manager.getState()
  const results = [...state.TestResults]

  if(!isArr(rewind) || !rewind?.length) return results

  const pipeline = pPipe(...rewind as UnaryFunction<any, unknown>[])
  await pipeline()

  return results

}
