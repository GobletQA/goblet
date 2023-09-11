import type { TExamCliOpts, TExamConfig, TPipelineInit } from '@GEX/types'

import { loadFiles } from './loadFiles'
import { nanoid } from '@keg-hub/jsutils/nanoid'
import { flatArr } from '@keg-hub/jsutils/flatArr'
import { timedRun } from '@keg-hub/jsutils/timedRun'
import { RunPipeline } from '../pipelines/RunPipeline'
import { onStartupStep } from '../pipelines/steps/onStartupStep'
import { onShutdownStep } from '../pipelines/steps/onShutdownStep'

type TInitExamCfg = TExamConfig & { file?:string }

const initPipeline = async (cfg:TPipelineInit) => {

  cfg?.config?.onStartup?.length
    && await onStartupStep(cfg)

  const resp = await RunPipeline(cfg)

  cfg?.config?.onShutdown?.length
    && await onShutdownStep(cfg)

  return flatArr(resp)
}

export const initLocal = async (exam:TInitExamCfg, opts:TExamCliOpts) => {
  const locations = await loadFiles(exam)

  return await timedRun(initPipeline, {
    id: nanoid(),
    config: exam,
    testMatch: locations,
  })
}