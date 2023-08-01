import type {
  TStateObj,
  TPipelineInit,
  TPipelineArgs,
  TPipeStepFunc
} from '@GEX/types'

import { Logger } from '@GEX/utils/logger'
import {PipelineTag} from '@GEX/constants/tags'
import {
  argsState,
  stateManager,
  countManager,
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
      const pArgs = argsState.getState<TPipelineArgs>()
      const pState = stateManager.getState<TStateObj>()
      const { count } = countManager.getState<Record<`count`, number>>()
      const stepName = cb.name || count

      try {
        Logger.debug(`${Logger.colors.green(pArgs.tag)} - ${Logger.colors.gray(`${count}. ${stepName}`)}`)
        const response = await cb({...pArgs, state:pState}, stateManager, input)
        countManager.setValue(`count`, count + 1)

        return response
      }
      catch(err){

        /**
         * Add flag if pipeline should exit on failed step or continue on
         * If exit on failed step, we should throw here instead of log
         */
        Logger.empty()
        Logger.error(Logger.colors.red(`${pArgs.tag} - ${count}. ${stepName}`))
        Logger.log(err)
        Logger.empty()

        return undefined
      }
    }
  }
  catch(err){
    Logger.error(err)
    throw err
  }
}