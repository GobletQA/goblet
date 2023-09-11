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
      testRetry: config.testRetry ?? RunnerCfg.testRetry,
      suiteRetry: config.suiteRetry ?? RunnerCfg.suiteRetry,
      reuseRunner: config.reuseRunner ?? RunnerCfg.reuseRunner,
      exitOnFailed: config.exitOnFailed ?? RunnerCfg.exitOnFailed,
      skipAfterFailed: config.skipAfterFailed ?? RunnerCfg.skipAfterFailed,
      omitTestResults: config.omitTestResults || RunnerCfg.omitTestResults,
      testTimeout: isNum(config.testTimeout) ? config.testTimeout : RunnerCfg.testTimeout,
      suiteTimeout: isNum(config.suiteTimeout) ? config.suiteTimeout : RunnerCfg.suiteTimeout,
    },
    environment: {
      ...EnvironmentCfg,
      envs: {...EnvironmentCfg.envs, ...config.envs},
      globals: {...EnvironmentCfg.globals, ...config.globals},
    }
  } as TExecPassThroughOpts
}
