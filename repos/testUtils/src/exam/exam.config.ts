/**
 * General Config that executes tests for Goblet Apps
 * Command looks something like this, run from the testUtils root directory
 * @example
 * node ../exam/.bin/exam.js --config ./exam/exam.config.ts --root /goblet/repos/lancetipton -t Test-World.feature
 */

// Must load this first because it loads the alias
import { aliases } from './setupTestAliases'

import type { TBrowserConf } from '../types'
import type { TTestMatch } from '@gobletqa/shared/utils/buildTestMatchFiles'
import type { TExamConfig, TExamRunners, TExRunnerCfg } from '@gobletqa/exam'


import path from 'path'
import { EExTestMode } from '@gobletqa/exam'
import { emptyArr, emptyObj, ensureArr, flatUnion} from '@keg-hub/jsutils'
import { getGobletConfig } from '@gobletqa/shared/goblet/getGobletConfig'
import { buildTestMatchFiles } from '@gobletqa/shared/utils/buildTestMatchFiles'
import { getParkinSupport, getStepDefinitions } from '@GTU/Parkin/loadSupportFiles'

import { buildTestGobletOpts } from '@GTU/Utils/buildTestGobletOpts'
import { getRepoGobletDir } from '@gobletqa/shared/utils/getRepoGobletDir'
import { taskEnvToBrowserOpts } from '@gobletqa/screencast/libs/utils/taskEnvToBrowserOpts'
import { getContextOpts } from '@gobletqa/screencast/libs/playwright/helpers/getContextOpts'

const OnStartupLoc = path.resolve(__dirname, './onStartup.ts')
const OnShutdownLoc = path.resolve(__dirname, './onShutdown.ts')
const RunnerLoc = path.resolve(__dirname, './FeatureRunner.ts')
const ReporterLoc = path.resolve(__dirname, './FeatureReporter.ts')
const TransformLoc = path.resolve(__dirname, './FeatureTransform.ts')
const EnvironmentLoc = path.resolve(__dirname, './FeatureEnvironment.ts')

export type TExamConfOpts = TTestMatch & {
  title?:string
  rootDir?:string
  testDir?:string
  extensions?:string[]
  reportOutputPath?:string
  globals?:Record<any, any>
}

const ExamConfig = ():TExamConfig => {
  const {
    GOBLET_CONFIG_BASE,
    GOBLET_MOUNT_ROOT,
    GOBLET_TEST_DEBUG
  } = process.env

  const config = getGobletConfig()

  GOBLET_TEST_DEBUG &&
    process.stdout.write(`\n[Goblet] Loaded Config:\n${JSON.stringify(config, null, 2)}\n`)

  const baseDir = getRepoGobletDir(config)
  const { devices, ...browserOpts } = taskEnvToBrowserOpts(config)
  const browserConf = browserOpts as TBrowserConf

  const contextOpts = getContextOpts(emptyObj, config)
  const gobletOpts = buildTestGobletOpts(config, browserConf)
  const testDir = path.join(baseDir, config.paths.featuresDir)

  // @ts-ignore
  const examConfig = config?.testConfig || emptyObj

  const rootDir = examConfig?.rootDir
    || config.paths.repoRoot
    || GOBLET_CONFIG_BASE
    || GOBLET_MOUNT_ROOT
    || `/goblet`

  const testMatch = examConfig.testMatch
    || buildTestMatchFiles({ type: `feature`, ext: `feature`, extOnly: true })
    || emptyArr

  return {
    envs: {
      EXAM_ENV: 1,
      // GB_REPO_NO_SECRETS: 1,
      GOBLET_CONFIG_BASE: baseDir
    },
    timeout: 10000,
    // testIgnore: [],
    // reporter: {},
    // loaderIgnore:[],
    // globalTimeout: 0,
    // transformIgnore: [],
    // esbuild: {},
    rootDir,
    testMatch,
    bail: 1,
    workers: 1,
    debug: true,
    verbose: true,
    colors: false,
    concurrency: 1,
    runInBand: true,
    passWithNoTests: true,
    mode: EExTestMode.serial,
    aliases: {...aliases, ...examConfig?.aliases},
    extensions: flatUnion([...ensureArr(examConfig?.extensions), `.feature`]),
    /** Pass on the browser options defined from the task that started the process */
    globals: {
      __DEV__: true,
      ...examConfig?.globals,
      __goblet: {
        config,
        options: gobletOpts,
        browser: browserOpts,
        paths: {...config.paths},
        context: { options: contextOpts },
      },
    },
    reporters: [
      ...ensureArr(examConfig.reporters),
      [ReporterLoc, {}]
    ].filter(Boolean) as any,
    transforms: {
      ...examConfig.transforms,
      [`.feature`]: [TransformLoc, {}]
    },
    preEnvironment:flatUnion([...ensureArr(examConfig.preEnvironment)]),
    environment: [EnvironmentLoc, {}],
    /** Add all support and step files and ensure they are loaded before running the tests */
    postEnvironment: flatUnion([
      ...ensureArr(examConfig.postEnvironment),
      ...getParkinSupport(config),
      ...getStepDefinitions(config),
    ]),
    preRunner:flatUnion([...ensureArr(examConfig.preRunner)]),
    postRunner:flatUnion([...ensureArr(examConfig.postRunner)]),
    runners: {
      ...examConfig.runners,
      [`.feature`]: [RunnerLoc, {
        slowMo: 100,
        debug: false,
        timeout:30000,
        verbose: true,
        globalTimeout:60000,
        omitTestResults: [],
      }]
    },
    onStartup: [
      OnStartupLoc,
      ...ensureArr(examConfig.onStartup),
    ],
    onShutdown: [
      OnShutdownLoc,
      ...ensureArr(examConfig.onShutdown),
    ]
  }

}

export default ExamConfig