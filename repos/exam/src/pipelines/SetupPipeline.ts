import { TPipelineInit } from './types'


import pPipe from 'p-pipe'
import {
  aliasStep,
  esbuildStep,
  setupPipeStep,
  environmentStep,
  preEnvironmentStep,
  postEnvironmentStep
} from './steps'

import {pipelineHoc} from './pipelineHoc'


export const SetupPipeline = async (args:TPipelineInit) => {
  try {
    const pipeline = pPipe(
      pipelineHoc(setupPipeStep, args, {}),
      pipelineHoc(aliasStep),
      pipelineHoc(esbuildStep),
      pipelineHoc(preEnvironmentStep),
      pipelineHoc(environmentStep),
      pipelineHoc(postEnvironmentStep),
    )
    
    const responses = await pipeline()
    console.log(`------- responses -------`)
    return []
  }
  catch(err){
    console.log(`------- err -------`)
    console.log(err)
    return []
  }

}