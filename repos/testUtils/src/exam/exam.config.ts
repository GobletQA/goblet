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

import type { TExamConfig } from '@gobletqa/exam'
import type { TWorldConfig } from '@ltipton/parkin'
import type { TBrowserConf, TGobletConfig, TGobletTestOpts } from '../types'

import path from 'path'
import { isArr } from '@keg-hub/jsutils'
import { EExTestMode } from '@gobletqa/exam'
import { ENVS } from '@gobletqa/environment'
import { getContextOpts } from '@gobletqa/browser'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { flatUnion} from '@keg-hub/jsutils/flatUnion'
import { ensureArr } from '@keg-hub/jsutils/ensureArr'
import { getWorld } from '@gobletqa/workflows/repo/world'
import { getParkinOptions } from '@GTU/Parkin/parkinTestInit'
import { getRepoGobletDir, getGobletConfig } from '@gobletqa/goblet'
import { buildTestMatchFiles } from '@GTU/Utils/buildTestMatchFiles'
import { getParkinTestInit, getStepDefinitions } from '@GTU/Parkin/loadSupportFiles'

import { getTimeouts } from '@GTU/Utils/getTimeouts'
import { taskEnvToBrowserOpts } from '@gobletqa/browser'
import { buildTestGobletOpts } from '@GTU/Utils/buildTestGobletOpts'

// Default to 20 seconds test timeout
// Default to 1hr global suite timeout
const defTimeouts = {testTimeout: 20000, suiteTimeout: 60000 * 60}
const OnStartupLoc = path.resolve(__dirname, './onStartup.ts')
const OnShutdownLoc = path.resolve(__dirname, './onShutdown.ts')
const RunnerLoc = path.resolve(__dirname, './feature/Runner.ts')
const EnvironmentLoc = path.resolve(__dirname, './feature/Environment.ts')
const CliReporterLoc = path.resolve(__dirname, './reporters/cli/CliReporter.ts')
const HtmlReporterLoc = path.resolve(__dirname, './reporters/html/HtmlReporter.ts')

/**
 * This reporter is always included
 * It handles dispatching events to registered listeners
 * Which is how test traces, and videos are handled 
 */
const EventReporterLoc = path.resolve(__dirname, './reporters/event/EventReporter.ts')

export type TExamCfgArgs = {
  base?:string
  world?:TWorldConfig
  config?:TGobletConfig
}

const builtReporters = (
  examConfig:Partial<TExamConfig>,
  gobletOpts:TGobletTestOpts
) => {
  const built = isArr(examConfig.reporters)
    ? examConfig.reporters
    : [
        [CliReporterLoc, {}],
        [HtmlReporterLoc, {
          saveReport: gobletOpts.saveReport,
          saveScreenshot: gobletOpts.saveScreenshot
        }]
      ]

  return ([...built, [EventReporterLoc, {}]]).filter(Boolean)
}

const ExamConfig = (cfgArgs:TExamCfgArgs=emptyObj):TExamConfig => {

  const config = cfgArgs?.config || getGobletConfig(cfgArgs)
  const examConfig = config?.testConfig || emptyObj as Partial<TExamConfig>
  const world = cfgArgs?.world || getWorld(config)

  ENVS.GOBLET_TEST_DEBUG &&
    process.stdout.write(`\n[Goblet] Loaded Config:\n${JSON.stringify(config, null, 2)}\n`)

  const baseDir = getRepoGobletDir(config)
  const { devices, ...browserOpts } = taskEnvToBrowserOpts()
  // Any options passed from the task should override options in the world config
  const browserConf = {...world?.$browser, ...browserOpts} as TBrowserConf
  const contextOpts = getContextOpts({ config, world })

  const gobletOpts = buildTestGobletOpts(config, browserConf)
  const rootDir = examConfig?.rootDir || config.paths.repoRoot

  return {
    // debug: true,
    // esbuild: {},
    // verbose: true,
    // testIgnore: [],
    // loaderIgnore:[],
    // transformIgnore: [],
    // exitOnFail: false,
    // skipAfterFailed: true,
    rootDir,
    bail: 5,
    workers: 1,
    testRetry: 1,
    suiteRetry: 0,
    colors: false,
    concurrency: 1,
    runInBand: true,
    reuseRunner: true,
    passWithNoTests: false,
    mode: EExTestMode.serial,
    ...examConfig,
    transforms: {...examConfig.transforms},
    aliases: {...aliases, ...examConfig?.aliases},
    ...getTimeouts({examConfig, defs: defTimeouts }),
    reporters: builtReporters(examConfig, gobletOpts),
    extensions: flatUnion([...ensureArr(examConfig?.extensions), `.feature`]),
    testMatch: examConfig.testMatch
      || buildTestMatchFiles({ type: `feature`, ext: `feature`, extOnly: true })
      || emptyArr,
    envs: {
      // GB_REPO_NO_SECRETS: 1,
      GOBLET_FULL_SCREEN_VIDEO: 1,
      ...examConfig?.envs,
      EXAM_ENV: 1,
      GOBLET_CONFIG_BASE: baseDir,
    },
    /** Pass on the browser options defined from the task that started the process */
    globals: {
      ...examConfig?.globals,
      __goblet: {
        config,
        repoDir: rootDir,
        options: gobletOpts,
        browser: browserConf,
        context: { options: contextOpts }
      },
    },
    preEnvironment:flatUnion([
      ...ensureArr(examConfig.preEnvironment),
      ...getParkinTestInit(config),
    ]),
    environment: [EnvironmentLoc, {
      parkin: getParkinOptions()
    }],
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
        // TODO: these values should come from ENVS / config
        slowMo: 100,
        debug: false,
        verbose: true,
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