import type { TPipelineArgs, TStateManager, TUnaryFunction } from '@GEX/types'

import { isArr } from '@keg-hub/jsutils/isArr'
import { promisePipe } from '@GEX/utils/promisePipe'

export const rewindStep = () => {
  const rewindCB = async (args:TPipelineArgs, manager?:TStateManager) => {

    const { rewind } = args
    const state = manager.getState()
    const results = state.TestResults ? [...state.TestResults] : []

    if(!isArr(rewind) || !rewind?.length) return results

    const pipeline = promisePipe(...rewind as TUnaryFunction<any, unknown>[])
    await pipeline()

    return results

  }

  rewindCB.name = `rewindStep`
  return rewindCB
}
