import type {
  TExamConfig,
  TExecPassThroughOpts,
} from '@GEX/types'

import {
  RunnerCfg,
  TransformCfg,
  EnvironmentCfg
} from '@GEX/constants/defaults'
import { isNum } from '@keg-hub/jsutils/isNum'

export const buildPassThrough = (config:TExamConfig) => {
  return {
    transform: {
      ...TransformCfg,
      transformIgnore: config.transformIgnore || TransformCfg.transformIgnore
    },
    runner: {
      ...RunnerCfg,
      bail: config.bail ?? RunnerCfg.bail,
      debug: config.debug ?? RunnerCfg.debug,
      verbose: config.verbose ?? RunnerCfg.verbose,
      reuseRunner: config.reuseRunner ?? RunnerCfg.reuseRunner,
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
