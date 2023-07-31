import type { GlobOptions } from 'glob'
import type {
  TExecuteCfg,
  TExamConfig,
  TExRunnerCfg,
  TExTransformCfg,
  TExEnvironmentCfg,
} from '@GEX/types'

import { EExTestMode } from '@GEX/types'
import {emptyArr} from '@keg-hub/jsutils'

export const globFileIgnore = [
  `/node_modules/`,
  `\\.pnp\\.[^\\\/]+$`
]

export const DefaultReporters = {
  silent: `silent`,
  default: `default`,
}


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

  /**
   * Removes specific fields from the test result response
   * Use dot notation for sub-paths
   * For example with the path `describe.tests.failedExpectations`
   * The result object will not include `failedExpectations` for any `tests`
   * I.E. `results` === `{ describes: { tests: [{ failedExpectations: undefined }] } }`
   */
  omitTestResults: []
}

export const LoaderCfg = {
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

  aliases: {},
  cache: true,
  loaderIgnore: emptyArr,
  testIgnore: globFileIgnore,

  esbuild: {
    format: `cjs`,
    target: `esnext`,
    platform: `node`,
  }
}

export const GlobFilesCfg:GlobOptions = {
  nodir: true,
  // follow:true,
  absolute: true,
  cwd: LoaderCfg.rootDir,
  ignore:[
    ...globFileIgnore,
    ...LoaderCfg.testIgnore,
    ...LoaderCfg.loaderIgnore,
  ],
}

export const EnvironmentCfg:TExEnvironmentCfg = {
  envs: {
    EXAM_ENV: 1,
  },
  globals: {},
}

export const TransformCfg:TExTransformCfg = {
  transformIgnore: globFileIgnore
}

export const ExecuteCfg:Omit<TExecuteCfg, `exam`> = {
  runners:{},
  transforms:{},
  passthrough:{},
  preEnvironment:[],
  postEnvironment:[],
  // environment: undefined,
}

export const ExCfg:Partial<TExamConfig> = {
  /**
   * ----- TODO: Need to implement these ----- *
   */
  testRetry: 0,
  suiteRetry: 0,
  silent: false,

  /**
   * ----- Implemented ----- *
   */
  bail: 0,
  workers: 1,
  reporter: {},
  colors: true,
  concurrency: 1,
  runInBand: false,
  reporters: [`default`],
  passWithNoTests: false,
  mode: EExTestMode.serial,
  testMatch: [
    `**/__tests__/**/*.[jt]s?(x)`,
    `**/?(*.)+(spec|test).[jt]s?(x)`
  ],

  // Special handling for custom events
  events: {} as any,
}

export const ExamCfg = {
  ...LoaderCfg,
  ...RunnerCfg,
  ...TransformCfg,
  ...EnvironmentCfg,
  ...ExecuteCfg,
  ...ExCfg
} as TExamConfig


export const PoolCfg = {
  size: 1,
  worker: {},
}

export const WorkerEnvs = [
  `NODE_ENV`,
  `EXAM_CLI_ENV`,
  `GB_LOG_LEVEL`,
  `EXAM_LOG_LEVEL`,
  `EXAM_CLI_DEBUG`,
  `EXAM_CLI_VERBOSE`,
  `GOBLET_TEST_DEBUG`,
  `GOBLET_TEST_VERBOSE`,
]

export const ExamLogLevel = `info`