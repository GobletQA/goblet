import type { TPipelineInit, TRunResult } from '@GEX/types'

import { RunPipeline } from './RunPipeline'
import { flatArr } from '@keg-hub/jsutils/flatArr'
import { onStartupStep } from './steps/onStartupStep'
import { onShutdownStep } from './steps/onShutdownStep'

export const initPipeline = async (cfg:TPipelineInit) => {
  cfg?.config?.onStartup?.length
    && await onStartupStep(cfg)

  const resp = await RunPipeline(cfg)

  cfg?.config?.onShutdown?.length
    && await onShutdownStep(cfg)

  return flatArr<TRunResult>(resp)
}
