import type {
  TExecuteCfg,
  TExamConfig,
  TExRunnerCfg,
  TExTransformCfg,
  TExEnvironmentCfg,
} from '@GEX/types'


import { ELoadType } from "@GEX/types"
import { EExTestMode } from '@GEX/types'
import {emptyArr} from '@keg-hub/jsutils'

export const RunnerCfg:TExRunnerCfg = {
  /**
   * Debug logging output
   */
  debug: false,

  /**
   * Verbose logging output
   */
  verbose: false,

  /**
   * Timeout per test - 30 seconds (default)
   */
  timeout: 30000,

  /**
   * Global timeout for test run per file - 20min (default)
   */
  globalTimeout: 60000 * 20,
}

export const LoaderCfg = {
  /**
   * We default to require because we use esbuild-register by default as well
   * Which allows us to import modules (i.e. `.mjs`|`.mts`) using the require method
   */
  loadType: ELoadType.require,

  /**
   * Default to the current working directory
   * It's expected that this will be overwritten
   * But if not, assume we are in the correct location
   */
  rootDir: process?.cwd?.(),

  /**
   * Default extensions loaded by the Exam Loader class
   */
  extensions: [
    `.js`,
    `.jsx`,
    `.cjs`,
    `.mjs`,
    `.ts`,
    `.cts`,
    `.mts`,
    `.tsx`,
  ],

  testIgnore: emptyArr,
  loaderIgnore: emptyArr,
}

export const EnvironmentCfg:TExEnvironmentCfg = {
  envs: {},
  globals: {},
}

export const TransformCfg:TExTransformCfg = {}

export const ExecuteCfg:Omit<TExecuteCfg, `exam`> = {
  runners:{},
  passthrough:{},
  transformers:{},
  environments:{},
  preEnvironment:[],
  postEnvironment:[],
}

export const ExCfg:Partial<TExamConfig> = {
  mode: EExTestMode.parallel,
  transformIgnore: [
    `/node_modules/`,
    `\\.pnp\\.[^\\\/]+$`
  ]
}

export const ExamCfg = {
  ...LoaderCfg,
  ...RunnerCfg,
  ...TransformCfg,
  ...EnvironmentCfg,
  ...ExecuteCfg,
  ...ExCfg
} as TExamConfig


