import {
  TStateObj,
  TPipelineInit,
  TPipelineArgs,
  TPipeStepFunc
} from '@GEX/types'

import { Logger } from '@GEX/utils/logger'
import {
  argsState,
  stateManager,
} from './states/pipelineStates'

export const pipelineHoc = (
  cb:TPipeStepFunc,
  args?:TPipelineInit|TPipelineArgs,
  state?:TStateObj,
) => {

  args && argsState.addState({ ...args, rewind: [] })
  state && stateManager.addState(state)

  try {
    return async (input:any) => {
      try {
        const pArgs = argsState.getState<TPipelineArgs>()
        const pState = stateManager.getState<TStateObj>()
        const response = await cb({...pArgs, state:pState}, stateManager, input)

        return response
      }
      catch(err){
        Logger.error(err)

        return undefined
      }
    }
  }
  catch(err){
    Logger.error(err)
    throw err
  }
}