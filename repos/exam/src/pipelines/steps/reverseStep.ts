import { TPipelineArgs } from '@GEX/types'
import { UnaryFunction } from 'p-pipe'

import pPipe from 'p-pipe'
import { isArr } from '@keg-hub/jsutils'
import { Logger } from '@GEX/utils/logger'

export const reverseStep = async (args:TPipelineArgs) => {
  Logger.debug(`------- reverseStep -------`)
  
  const { reverse } = args
  
  if(!isArr(reverse) || !reverse?.length) return args

  const pipeline = pPipe(...(reverse.reverse() as UnaryFunction<any, any>[]))
  await pipeline()

  return args
}
