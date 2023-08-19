import { TPipelineInit } from '@GEX/types'


import pPipe from 'p-pipe'
import {
  aliasStep,
  esbuildStep,
  rewindStep,
  reportersStep,
  setupPipeStep,
  environmentStep,
  preEnvironmentStep,
  postEnvironmentStep
} from './steps'

import {pipelineHoc} from './pipelineHoc'
import {Errors} from '@GEX/constants/errors'
import {formatArgsTask} from './tasks/formatArgsTask'


export const SetupPipeline = async (args:TPipelineInit) => {
  const pipArgs = formatArgsTask(args)

  try {
    const pipeline = pPipe(
      pipelineHoc(setupPipeStep, pipArgs),
      pipelineHoc(aliasStep),
      pipelineHoc(esbuildStep),
      pipelineHoc(reportersStep),
      pipelineHoc(preEnvironmentStep),
      pipelineHoc(environmentStep),
      pipelineHoc(postEnvironmentStep),
      /**
       * TODO: pass in args to keep the rewind methods and the existing state
       * - Then pass that on to the RunPipeline
       * - This allows reuse of the same environment over and over again
       * - So we don't have to recreate it for each test
       * - It's basically caching the environment for each worker
       */
      pipelineHoc(rewindStep( /** args to save the environment */)),
    )

    return await pipeline()
  }
  catch(err){
    Errors.PipelineFailed(err)
    return []
  }

}
