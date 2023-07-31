import type { Exam } from '@GEX/Exam'
import type {
  TExamConfig,
  TExecPassThroughOpts,
} from '@GEX/types'

import { isNum } from '@keg-hub/jsutils'
import {
  RunnerCfg,
  TransformCfg,
  EnvironmentCfg
} from '@GEX/constants/defaults'

export const buildPassThrough = (config:TExamConfig) => {
  return {
    transform: {
      ...TransformCfg,
      transformIgnore: config.transformIgnore || TransformCfg.transformIgnore
    },
    runner: {
      ...RunnerCfg,
      debug: config.debug ?? RunnerCfg.debug,
      verbose: config.verbose ?? RunnerCfg.verbose,
      timeout: isNum(config.timeout) ? config.timeout : RunnerCfg.timeout,
      omitTestResults: config.omitTestResults || RunnerCfg.omitTestResults,
      globalTimeout: isNum(config.globalTimeout) ? config.globalTimeout : RunnerCfg.globalTimeout,
    },
    environment: {
      ...EnvironmentCfg,
      envs: {...EnvironmentCfg.envs, ...config.envs},
      globals: {...EnvironmentCfg.globals, ...config.globals},
    }
  } as TExecPassThroughOpts
}
