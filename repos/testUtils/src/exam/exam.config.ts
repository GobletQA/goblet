import type { TExamConfig, TExamRunners, TExRunnerCfg } from '@gobletqa/exam'

import path from 'path'
import { EExTestMode } from '@GEX/types'
import { getGobletConfig } from '@gobletqa/shared/goblet/getGobletConfig'

const RunnerLoc = path.resolve(__dirname, './FeatureRunner')
const ReporterLoc = path.resolve(__dirname, './FeatureReporter')
const TransformLoc = path.resolve(__dirname, './FeatureTransform')
const EnvironmentLoc = path.resolve(__dirname, './FeatureEnvironment')

export const ExamConfig:TExamConfig = {

  
  rootDir: undefined,
  testDir: undefined,

  timeout: 0,
  debug: true,
  verbose: true,
  globalTimeout: 0,

  esbuild: {},
  testMatch: [],
  testIgnore: [],
  loaderIgnore:[],
  transformIgnore: [],
  extensions: [`.feature`],

  bail: true,
  workers: 1,
  colors: false,
  concurrency: 1,
  runInBand: true,
  passWithNoTests: true,
  mode: EExTestMode.serial,
  environment: [EnvironmentLoc, {
    
  }],
  runners: {
    [`.feature`]: [RunnerLoc, {
      slowMo: 100,
      debug: false,
      timeout:30000,
      verbose: true,
      globalTimeout:60000,
      omitTestResults: [],
    }]
  },
  
  transforms: {
    [`.feature`]: [TransformLoc, {
      
    }]
  },

  reporter: {},
  reporters: [ReporterLoc],

  preRunner:[
    `__mocks__/preRunner.ts`,
  ],

  postRunner:[
    `__mocks__/postRunner.ts`,
  ],

  preEnvironment:[
    `__mocks__/preEnvironment.ts`,
  ],

  postEnvironment:[
    `__mocks__/postEnvironment.ts`,
  ],

  envs: {},
  globals: {},

}

export default ExamConfig