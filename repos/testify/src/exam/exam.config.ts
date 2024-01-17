/**
 * General Config that executes tests for Goblet Apps
 * Command looks something like this, run from the testify root directory
 * @example
 * node ../exam/.bin/exam.js --config ./exam/exam.config.ts --root /goblet/repos/lancetipton -t Test-World.feature
 * Command from the goblet root directory
 * @example
 * node ./repos/exam/.bin/exam.js --config ../../app/repos/testify/src/exam/exam.config.ts --root /goblet/workspace -t Log-In-and-Out.feature
 
 */

// Must load this first because it loads the alias
import { aliases } from './setupTestAliases'

import type { TExamConfig } from '@gobletqa/exam'
import type { TBrowserConf, TExamCfgArgs } from '@GTU/Types'

import path from 'path'
import { EExTestMode } from '@gobletqa/exam'
import { ENVS } from '@gobletqa/environment'
import { getClientWorld } from '@gobletqa/repo'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { checkDistDir } from '@GTU/Utils/checkDistDir'
import { flatUnion } from '@keg-hub/jsutils/flatUnion'
import { ensureArr } from '@keg-hub/jsutils/ensureArr'
import { getExamTimeouts } from '@GTU/Utils/getExamTimeouts'
import { getParkinOptions } from '@GTU/Parkin/parkinTestInit'
import { getReporters } from '@GTU/Exam/reporters/getReporters'
import { getRepoGobletDir, getGobletConfig } from '@gobletqa/goblet'
import { buildTestMatchFiles } from '@GTU/Utils/buildTestMatchFiles'
import { buildTestGobletOpts } from '@GTU/Utils/buildTestGobletOpts'
import { taskEnvToBrowserOpts, getContextOpts } from '@gobletqa/browser'
import { getParkinTestInit, getStepDefinitions } from '@GTU/Parkin/loadSupportFiles'

// Default to 20 seconds test timeout
// Default to 1hr global suite timeout
const defTimeouts = {testTimeout: 20000, suiteTimeout: 60000 * 60}


const {ext, dirname} = checkDistDir(__dirname, `./exam`)
const OnStartupLoc = path.resolve(dirname, `./onStartup.${ext}`)
const OnShutdownLoc = path.resolve(dirname, `./onShutdown.${ext}`)
const RunnerLoc = path.resolve(dirname, `./feature/Runner.${ext}`)
const EnvironmentLoc = path.resolve(dirname, `./feature/Environment.${ext}`)

const ExamConfig = (cfgArgs:TExamCfgArgs=emptyObj):TExamConfig => {
  const config = getGobletConfig(cfgArgs)
  const world = getClientWorld(config, false)
  const examConfig = (config?.testConfig || emptyObj) as Partial<TExamConfig>

  ENVS.GOBLET_TEST_DEBUG &&
    process.stdout.write(`\n[Goblet] Loaded Config:\n${JSON.stringify(config, null, 2)}\n`)

  const baseDir = getRepoGobletDir(config)
  const { devices, ...browserOpts } = taskEnvToBrowserOpts()
  // Any options passed from the task should override options in the world config
  const browserConf = {
    ...world?.$browser,
    ...browserOpts
  } as TBrowserConf

  const contextOpts = getContextOpts({
    world,
    config,
    type: browserConf.type,
  })
  const gobletOpts = buildTestGobletOpts(config, browserConf, world?.$testOptions)

  const rootDir = examConfig?.rootDir || config?.paths?.repoRoot

  const examCfg:TExamConfig = {
    // bail: 5,
    // debug: true,
    // verbose: true,
    // esbuild: {},
    // testRetry: 1,
    // suiteRetry: 0,
    // testIgnore: [],
    // loaderIgnore:[],
    // transformIgnore: [],
    // exitOnFail: false,
    // skipAfterFailed: true,
    rootDir,
    workers: 1,
    colors: false,
    concurrency: 1,
    runInBand: true,
    reuseRunner: true,
    passWithNoTests: false,
    mode: EExTestMode.serial,
    ...examConfig,
    transforms: {...examConfig.transforms},
    aliases: {...aliases, ...examConfig?.aliases},
    ...getExamTimeouts({ examConfig, defs: defTimeouts }),
    reporters: getReporters(examConfig, gobletOpts),
    extensions: flatUnion([
      ...ensureArr(examConfig?.extensions),
      `.feature`
    ]),
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

  ENVS.GOBLET_TEST_DEBUG &&
    process.stdout.write(`\n[Goblet] Exam Config:\n${JSON.stringify(examCfg, null, 2)}\n`)

  return examCfg
}

export default ExamConfig