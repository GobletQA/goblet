import type { CodeRunner } from './codeRunner'
import type { TParkinTestConfig } from '@ltipton/parkin'
import type { TPlayerEventData, TPlayerTestEvent } from '@gobletqa/shared/types'
/**
 * This is needed so that expect is added to the global context
 * Which allows it to be referenced directly in step definitions
 */
import expect from 'expect'
import { Parkin } from '@ltipton/parkin'
import { unset, omitKeys } from '@keg-hub/jsutils'
import { ParkinTest } from '@ltipton/parkin/test'
import { getDefinitions } from '@gobletqa/shared/repo/getDefinitions'
import {
  SavedDataWorldPath,
  AutoSavedDataWorldPath,
  SavedLocatorWorldPath,
  AutoSavedLocatorWorldPath,
} from '@gobletqa/shared/constants'


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

let TestGlobalsCache = {}
let ProcessEnvCache = {}

const processENVs = {
  GOBLET_RUN_FROM_UI: `1`
}

/**
 * Use custom test runner from parkin
 * Jest does not allow calling from the Node directly
 * So we use Parkin's test runner instead
 */
const setTestGlobals = (Runner:CodeRunner, timeout?:number) => {
  const opts:TParkinTestConfig = {
    specDone: Runner.onSpecDone,
    suiteDone: Runner.onSuiteDone,
    specStarted: Runner.onSpecStarted,
    suiteStarted: Runner.onSuiteStarted,
  }

  const tOut = timeout || Runner.globalTimeout
  tOut && (opts.timeout = tOut)

  const PTE = new ParkinTest(opts)

  testGlobals.forEach((item) => {
    TestGlobalsCache[item] = global[item]
    global[item] = PTE[item]
  })
  
  // TODO: investigate overwriting all envs
  Object.entries(processENVs)
    .forEach(([key, val]) => {
      ProcessEnvCache[key] = process.env[key]
      process.env[key] = val
    })

  return PTE
}

/**
 * Sets up the global variables so they can be accesses in step definitions
 * Caches any existing globals so they can be reset after the test run
 * This ensures it doesn't clobber what ever already exists
 */
export const setupGlobals = (Runner:CodeRunner, timeout?:number) => {
  ;(TestGlobalsCache as any).expect = (global as any).expect
  ;(TestGlobalsCache as any).page = (global as any).page
  ;(TestGlobalsCache as any).context = (global as any).context
  ;(TestGlobalsCache as any).browser = (global as any).browser

  ;(global as any).expect = expect
  global.page = Runner.player.page
  global.browser = Runner.player.browser
  global.context = Runner.player.context
  return setTestGlobals(Runner, timeout)
}

/**
 * Uses the global test cache that was created in setupGlobals to reset their value
 * This ensures it doesn't clobber what ever already exists
 */
export const resetTestGlobals = () => {
  ;(global as any).expect = (TestGlobalsCache as any).expect
  ;(global as any).page = (TestGlobalsCache as any).page
  ;(global as any).context = (TestGlobalsCache as any).context
  ;(global as any).browser = (TestGlobalsCache as any).browser

  testGlobals.forEach((item) => global[item] = TestGlobalsCache[item])
  
  // TODO: investigate overwriting all envs
  Object.entries(processENVs)
    .forEach(([key, val]) => {
      process.env[key] = ProcessEnvCache[key]
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

  await getDefinitions(Runner?.player?.repo, undefined, false)
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


