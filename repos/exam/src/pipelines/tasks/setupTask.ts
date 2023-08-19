import {TPipelineArgs, TStateManager} from '@GEX/types'
import { buildPassThrough } from '@GEX/utils/buildPassThrough'

export const setupTask = (args:TPipelineArgs, manager?:TStateManager) => {
  const { config } = args
  const passthrough = buildPassThrough(config)

  return {
    passthrough
  }
}