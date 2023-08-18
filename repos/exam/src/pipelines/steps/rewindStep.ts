import type { UnaryFunction } from 'p-pipe'
import type { TPipelineArgs, TStateManager } from '@GEX/types'

import pPipe from 'p-pipe'
import { isArr } from '@keg-hub/jsutils'

export const rewindStep = () => {
  const rewindCB = async (args:TPipelineArgs, manager?:TStateManager) => {

    const { rewind } = args
    const state = manager.getState()
    const results = [...state.TestResults]

    if(!isArr(rewind) || !rewind?.length) return results

    const pipeline = pPipe(...rewind as UnaryFunction<any, unknown>[])
    await pipeline()

    return results

  }

  rewindCB.name = `rewindStep`
  return rewindCB
}
