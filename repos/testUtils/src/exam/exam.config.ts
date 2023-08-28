/**
 * General Config that executes tests for Goblet Apps
 * Command looks something like this, run from the testUtils root directory
 * @example
 * node ../exam/.bin/exam.js --config ./exam/exam.config.ts --root /goblet/repos/lancetipton -t Test-World.feature
 * Command from the goblet root directory
 * @example
 * node ./repos/exam/.bin/exam.js --config ../../app/repos/testUtils/src/exam/exam.config.ts --root /goblet/workspace -t Log-In-and-Out.feature
 
 */

// Must load this first because it loads the alias
import { aliases } from './setupTestAliases'

import type { TBrowserConf } from '../types'
import type { TExamConfig } from '@gobletqa/exam'
import type { TTestMatch } from '@gobletqa/shared/utils/buildTestMatchFiles'

import path from 'path'
import { isArr } from '@keg-hub/jsutils'
import { EExTestMode } from '@gobletqa/exam'
import { ENVS } from '@gobletqa/environment'
import { getContextOpts } from '@gobletqa/browser'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { flatUnion} from '@keg-hub/jsutils/flatUnion'
import { ensureArr } from '@keg-hub/jsutils/ensureArr'
import { getParkinOptions } from '@GTU/Parkin/parkinTestInit'
import { getRepoGobletDir, getGobletConfig } from '@gobletqa/goblet'
import { buildTestMatchFiles } from '@gobletqa/shared/utils/buildTestMatchFiles'
import { getParkinTestInit, getStepDefinitions } from '@GTU/Parkin/loadSupportFiles'

import { taskEnvToBrowserOpts } from '@gobletqa/browser'
import { buildTestGobletOpts } from '@GTU/Utils/buildTestGobletOpts'

const OnStartupLoc = path.resolve(__dirname, './onStartup.ts')
const OnShutdownLoc = path.resolve(__dirname, './onShutdown.ts')
const RunnerLoc = path.resolve(__dirname, './feature/Runner.ts')
const EnvironmentLoc = path.resolve(__dirname, './feature/Environment.ts')
const CliReporterLoc = path.resolve(__dirname, './feature/CliReporter.ts')
const HtmlReporterLoc = path.resolve(__dirname, './feature/HtmlReporter.ts')

/**
 * This reporter is always included
 * It handles dispatching events to registered listeners
 * Which is how test traces, and videos are handled 
 */
const EventReporterLoc = path.resolve(__dirname, './feature/EventReporter.ts')

export type TExamConfOpts = TTestMatch & {
  title?:string
  rootDir?:string
  testDir?:string
  extensions?:string[]
  reportOutputPath?:string
  globals?:Record<any, any>
}

const ExamConfig = ():TExamConfig => {

  const config = getGobletConfig()

  ENVS.GOBLET_TEST_DEBUG &&
    process.stdout.write(`\n[Goblet] Loaded Config:\n${JSON.stringify(config, null, 2)}\n`)

  const baseDir = getRepoGobletDir(config)
  const { devices, ...browserOpts } = taskEnvToBrowserOpts(config)
  const browserConf = browserOpts as TBrowserConf

  const contextOpts = getContextOpts({ config })
  const parkinRunOpts = getParkinOptions()
  const gobletOpts = buildTestGobletOpts(config, browserConf)

  // @ts-ignore
  const examConfig = config?.testConfig || emptyObj
  const reporters = isArr(examConfig.reporters)
    ? examConfig.reporters
    : [[CliReporterLoc, {}], [HtmlReporterLoc, {}]]

  const rootDir = examConfig?.rootDir
    || config.paths.repoRoot
    || ENVS.GOBLET_CONFIG_BASE
    || ENVS.GOBLET_MOUNT_ROOT
    || `/goblet`

  const testMatch = examConfig.testMatch
    || buildTestMatchFiles({ type: `feature`, ext: `feature`, extOnly: true })
    || emptyArr

  return {
    // debug: true,
    // esbuild: {},
    // reporter: {},
    // verbose: true,
    // testIgnore: [],
    // loaderIgnore:[],
    // globalTimeout: 0,
    // transformIgnore: [],
    envs: {
      EXAM_ENV: 1,
      // GB_REPO_NO_SECRETS: 1,
      GOBLET_CONFIG_BASE: baseDir
    },
    timeout: 15000,
    rootDir,
    testMatch,
    bail: 5,
    workers: 1,
    colors: false,
    concurrency: 1,
    runInBand: true,
    passWithNoTests: false,
    mode: EExTestMode.serial,
    aliases: {...aliases, ...examConfig?.aliases},
    extensions: flatUnion([...ensureArr(examConfig?.extensions), `.feature`]),
    /** Pass on the browser options defined from the task that started the process */
    globals: {
      ...examConfig?.globals,
      __goblet: {
        config,
        options: gobletOpts,
        browser: browserOpts,
        paths: {...config.paths},
        parkin: { run: parkinRunOpts },
        context: { options: contextOpts },
      },
    },
    reporters: [
      ...reporters,
      [EventReporterLoc, {}]
    ].filter(Boolean) as any,
    transforms: {
      ...examConfig.transforms,
    },
    preEnvironment:flatUnion([
      ...ensureArr(examConfig.preEnvironment),
      ...getParkinTestInit(config),
    ]),
    environment: [EnvironmentLoc, {}],
    /** Add all support and step files and ensure they are loaded before running the tests */
    postEnvironment: flatUnion([
      ...ensureArr(examConfig.postEnvironment),
      ...getStepDefinitions(config),
    ]),
    preRunner:flatUnion([...ensureArr(examConfig.preRunner)]),
    postRunner:flatUnion([...ensureArr(examConfig.postRunner)]),
    runners: {
      ...examConfig.runners,
      [`.feature`]: [RunnerLoc, {
        slowMo: 100,
        debug: false,
        timeout:15000,
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