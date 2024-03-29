import type { CodeRunner } from './codeRunner'
import type { TPlayerEventData, TPlayerTestEvent } from '@GBB/types'
import type { TRunResult, TParkinTestConfig } from '@ltipton/parkin'
import type {
  TBrowser,
  TBrowserPage,
  TBrowserContext,
} from '@GBB/types'


type TPTestCallback = (result:TRunResult) => any

/**
 * This is needed so that expect is added to the global context
 * Which allows it to be referenced directly in step definitions
 */
import expect from 'expect'
import { Parkin } from '@ltipton/parkin'
import { ENVS } from '@gobletqa/environment'
import { isStr } from '@keg-hub/jsutils/isStr'
import { unset } from '@keg-hub/jsutils/unset'
import { ParkinTest } from '@ltipton/parkin/test'
import { omitKeys } from '@keg-hub/jsutils/omitKeys'
import { WSPwConsole } from '@gobletqa/environment/constants'

import {
  SavedDataWorldPath,
  AutoSavedDataWorldPath,
  SavedLocatorWorldPath,
  AutoSavedLocatorWorldPath,
} from '@gobletqa/environment/constants'


const emptyConsoleLoc = { url: ``, line: ``, column: ``}
const testGlobals = [
  `it`,
  `xit`,
  `test`,
  `xtest`,
  `describe`,
  `xdescribe`,
  `afterAll`,
  `afterEach`,
  `beforeAll`,
  `beforeEach`,
]

type TTestGlobalCache = {
  expect?:any
  console?:Console
  browser?:TBrowser
  page?:TBrowserPage
  context?:TBrowserContext
}

let TestGlobalsCache:TTestGlobalCache = {}
let ProcessEnvCache = {}
const GobletGlobalCache = { __goblet: undefined }

const processENVs = {
  GOBLET_RUN_FROM_UI: `1`
}

/**
 * Use custom test runner from parkin
 * Jest does not allow calling from the Node directly
 * So we use Parkin's test runner instead
 */
const setTestGlobals = (Runner:CodeRunner) => {
  const opts:TParkinTestConfig = {
    testTimeout: Runner.timeout,
    suiteTimeout: Runner.suiteTimeout,
    /**
      * Typescript is dumb
      * TPlayerEventData does match TRunResult
      * It's just too far removed for typescript to know about it
      * So we recast the callbacks to Parkin test callbacks
     */
    onSpecDone: Runner.onSpecDone as TPTestCallback,
    onSuiteDone: Runner.onSuiteDone as TPTestCallback,
    onSpecStart: Runner.onSpecStart as TPTestCallback,
    onSuiteStart: Runner.onSuiteStart as TPTestCallback,
  }

  const PTE = new ParkinTest(opts)

  testGlobals.forEach((item) => {
    TestGlobalsCache[item] = global[item]
    global[item] = PTE[item]
  })
  
  // TODO: investigate overwriting all envs
  Object.entries(processENVs)
    .forEach(([key, val]) => {
      if(ENVS[key]) ProcessEnvCache[key] = ENVS[key]
      ENVS[key] = val
    })

  return PTE
}

/**
 * Temp method until Code Runner is migrated to use Exam Runner
 */
const setGlobalOpts = (Runner:CodeRunner) => {
  GobletGlobalCache.__goblet = global.__goblet

  const repo = Runner?.player?.repo

  global.__goblet = {
    config: {
      $ref: repo?.$ref,
      paths: repo?.paths,
      fileTypes: repo?.fileTypes,
    },
    options: {
      reusePage: true,
      reuseContext: true,
      saveTrace: false,
      saveVideo: false,
      saveReport: false,
      saveScreenshot: false,
    },
    repoDir: repo?.paths?.repoRoot,
    browser: Runner?.player?.browser?.__browserGoblet,
    context: { options: Runner?.player?.context?.__contextGoblet }
  }
}


const wrapConsoleMethod = (Runner:CodeRunner, type:keyof Console, ogConsole:Console) => {
  const ogMethod = ogConsole[type].bind(ogConsole)

  const method = function(arg:any, ...args:any[]) {
    ogMethod.call(ogConsole, arg, ...args)
    if(!isStr(arg) || !arg.includes(`label: 'Goblet SC'`)) return

    try {
      const text = [arg, ...args].reduce((acc, arg) => {
        if(!arg) return
        const str = JSON.stringify(arg)
        acc += `${str}\n${WSPwConsole}\n`
        return acc
      }, ``)
      Runner.player.onConsole({ type, text, location: emptyConsoleLoc })
    }
    catch(err){}
  }

  return method.bind(ogConsole)
}

const setGlobalConsole = (Runner:CodeRunner) => {
  if(!Runner.player.forwardLogs) return

  const ogConsole = global.console
  global.console = {
    ...global.console,
    dir: wrapConsoleMethod(Runner, `dir`, ogConsole),
    log: wrapConsoleMethod(Runner, `log`, ogConsole),
    warn: wrapConsoleMethod(Runner, `warn`, ogConsole),
    info: wrapConsoleMethod(Runner, `info`, ogConsole),
    debug: wrapConsoleMethod(Runner, `debug`, ogConsole),
    error: wrapConsoleMethod(Runner, `error`, ogConsole),
    trace: wrapConsoleMethod(Runner, `trace`, ogConsole),
    table: wrapConsoleMethod(Runner, `table`, ogConsole),
    count: wrapConsoleMethod(Runner, `count`, ogConsole),
    clear: wrapConsoleMethod(Runner, `clear`, ogConsole),
    profile: wrapConsoleMethod(Runner, `profile`, ogConsole),
    timeEnd: wrapConsoleMethod(Runner, `timeEnd`, ogConsole),
    profileEnd: wrapConsoleMethod(Runner, `profileEnd`, ogConsole),
    countReset: wrapConsoleMethod(Runner, `countReset`, ogConsole),
    // warning: wrapConsoleMethod(Runner, `warning`, ogConsole),
    // countEnd: wrapConsoleMethod(Runner, `countEnd`, ogConsole),
  } as Console
}

/**
 * Sets up the global variables so they can be accesses in step definitions
 * Caches any existing globals so they can be reset after the test run
 * This ensures it doesn't clobber what ever already exists
 */
export const setupGlobals = (Runner:CodeRunner) => {
  TestGlobalsCache.expect = (global as any).expect
  TestGlobalsCache.page = global.page
  TestGlobalsCache.context = global.context
  TestGlobalsCache.browser = global.browser
  TestGlobalsCache.console = global.console


  setGlobalOpts(Runner)
  setGlobalConsole(Runner)

  global.page = Runner.player.page
  global.browser = Runner.player.browser
  global.context = Runner.player.context
  ;(global as any).expect = expect

  return setTestGlobals(Runner)
}

/**
 * Uses the global test cache that was created in setupGlobals to reset their value
 * This ensures it doesn't clobber what ever already exists
 */
export const resetTestGlobals = () => {

  const globThis = global as TTestGlobalCache

  if(TestGlobalsCache.page) global.page = TestGlobalsCache.page
  if(TestGlobalsCache.expect) globThis.expect = TestGlobalsCache.expect
  if(TestGlobalsCache.context) global.context = TestGlobalsCache.context
  if(TestGlobalsCache.browser) global.browser = TestGlobalsCache.browser
  if(TestGlobalsCache.console) global.console = TestGlobalsCache.console

  global.__goblet = GobletGlobalCache.__goblet
  testGlobals.forEach((item) => global[item] = TestGlobalsCache[item])
  
  // TODO: investigate overwriting all envs
  Object.entries(processENVs)
    .forEach(([key, val]) => {
      if(ProcessEnvCache[key]) ENVS[key] = ProcessEnvCache[key]
      else delete ENVS[key]
    })

  TestGlobalsCache = {}
  ProcessEnvCache = {}
}

/**
 * Sets up Parkin globally, so it can be accessed by step definitions
 * Tries to use the existing Parkin instance on the Runner class
 */
export const setupParkin = async (Runner:CodeRunner) => {
  const PK = Runner?.player?.repo?.parkin
  if(!PK) throw new Error(`Repo is missing a parkin instance`)

  return PK
}


/**
 * ------ TODO: Move this to parkin ------ *
 * It should auto-clean up the world object after each spec
 */
const worldSavePaths = [
  SavedDataWorldPath,
  AutoSavedDataWorldPath,
  SavedLocatorWorldPath,
  AutoSavedLocatorWorldPath,
]

export const cleanupWorld = (PK:Parkin) => {
  worldSavePaths.forEach(loc => unset(PK?.world, loc))
}
/**
 * ------ END - TODO: Move this to parkin ------ *
 */

/**
 * There's a lot of meta-data that is added to the player tests results object
 * This clears out some of it, because the frontend does not need it
 */
export const clearTestResults = (result:TPlayerTestEvent|TPlayerEventData) => {
  return omitKeys<TPlayerTestEvent>(
    result,
    [
      `tests`,
      `describes`,
      `passedExpectations`,
      `failedExpectations`,
    ]
  )
}


