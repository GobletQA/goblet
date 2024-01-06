import type { TExRunResult, TPipelineInit } from '@GEX/types'

import {pipelineHoc} from './pipelineHoc'
import {Errors} from '@GEX/constants/errors'
import { promisePipe } from '@GEX/utils/promisePipe'
import {formatArgsTask} from './tasks/formatArgsTask'
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


export const RunPipeline = async (args:TPipelineInit) => {
  try {
    const pipeArgs = formatArgsTask(args)

    const pipeline = promisePipe(
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

    return await pipeline() as TExRunResult[]
  }
  catch(err){
    Errors.PipelineFailed(err)
    return [] as TExRunResult[]
  }
}