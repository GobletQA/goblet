import type { TPipelineInit } from '@GEX/types'

import pPipe from 'p-pipe'
import {
  aliasStep,
  runnerStep,
  esbuildStep,
  rewindStep,
  reportersStep,
  setupPipeStep,
  preRunnerStep,
  postRunnerStep,
  environmentStep,
  preEnvironmentStep,
  postEnvironmentStep
} from './steps'

import {pipelineHoc} from './pipelineHoc'
import {Errors} from '@GEX/constants/errors'
import {formatArgsTask} from './tasks/formatArgsTask'

export const RunPipeline = async (args:TPipelineInit) => {
  try {
    const pipeArgs = formatArgsTask(args)

    const pipeline = pPipe(
      pipelineHoc(setupPipeStep, pipeArgs),
      pipelineHoc(aliasStep),
      pipelineHoc(esbuildStep),
      pipelineHoc(reportersStep),
      pipelineHoc(preEnvironmentStep),
      pipelineHoc(environmentStep),
      pipelineHoc(postEnvironmentStep),
      pipelineHoc(preRunnerStep),
      pipelineHoc(runnerStep),
      pipelineHoc(postRunnerStep),
      pipelineHoc(rewindStep()),
    )

    return await pipeline()
  }
  catch(err){
    Errors.PipelineFailed(err)
    return []
  }
}