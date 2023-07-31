import {
  TStateObj,
  TStateManager,
  TPipelineInit,
  TPipelineArgs,
  TPipeStepFunc
} from './types'

import { createState } from './state'
import { Logger } from '@GEX/utils/logger'

const responseState = createState({ responses: [] })
const argsState = createState({ args: {} })
const stateManager = createState({})

export const pipelineHoc = (
  cb:TPipeStepFunc,
  args?:TPipelineInit|TPipelineArgs,
  state?:TStateObj,
) => {

  args && argsState.addState(args)
  state && stateManager.addState(state)
  try {
    return async (input:any) => {
      try {
        const pArgs = argsState.getState() as TPipelineArgs
        const pState = stateManager.getState() as TStateObj
        const response = await cb({...pArgs, state:pState}, stateManager, input)
        const resState = responseState.getState()
        responseState.setValue(`responses`, [...resState.responses, response])

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