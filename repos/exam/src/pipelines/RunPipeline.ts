import { TPipelineInit } from '@GEX/types'


import pPipe from 'p-pipe'
import {
  aliasStep,
  runnerStep,
  esbuildStep,
  reverseStep,
  reportersStep,
  setupPipeStep,
  preRunnerStep,
  postRunnerStep,
  environmentStep,
  preEnvironmentStep,
  postEnvironmentStep
} from './steps'

import {pipelineHoc} from './pipelineHoc'


export const RunPipeline = async (args:TPipelineInit) => {
  try {
    const pipeline = pPipe(
      pipelineHoc(setupPipeStep, args, {}),
      pipelineHoc(aliasStep),
      pipelineHoc(esbuildStep),
      pipelineHoc(reportersStep),
      pipelineHoc(preEnvironmentStep),
      pipelineHoc(environmentStep),
      pipelineHoc(postEnvironmentStep),
      pipelineHoc(preRunnerStep),
      pipelineHoc(runnerStep),
      pipelineHoc(postRunnerStep),
      pipelineHoc(reverseStep),
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