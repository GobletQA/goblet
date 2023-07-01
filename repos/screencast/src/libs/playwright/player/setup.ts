import type { CodeRunner } from './codeRunner'
import type { TPlayerTestEvent } from '@gobletqa/shared/types'

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

/**
 * Use custom test runner from parkin
 * Jest does not allow calling from the Node directly
 * So we use Parkin's test runner instead
 */
export const setTestGlobals = (Runner:CodeRunner, timeout=6000) => {

  const PTE = new ParkinTest({
    timeout: timeout,
    specDone: Runner.onSpecDone,
    suiteDone: Runner.onSuiteDone,
    specStarted: Runner.onSpecStarted,
    suiteStarted: Runner.onSuiteStarted,
  })

  testGlobals.forEach((item) => {
    TestGlobalsCache[item] = global[item]
    global[item] = PTE[item]
  })

  return PTE
}

/**
 * Sets up the global variables so they can be accesses in step definitions
 * Caches any existing globals so they can be reset after the test run
 * This ensures it doesn't clobber what ever already exists
 */
export const setupGlobals = (Runner:CodeRunner) => {
  ;(TestGlobalsCache as any).expect = (global as any).expect
  ;(TestGlobalsCache as any).context = (global as any).context

  ;(global as any).expect = expect
  global.context = Runner.player.context
  return setTestGlobals(Runner)
}

/**
 * Uses the global test cache that was created in setupGlobals to reset their value
 * This ensures it doesn't clobber what ever already exists
 */
export const resetTestGlobals = () => {
  ;(global as any).expect = (TestGlobalsCache as any).expect
  ;(global as any).context = (TestGlobalsCache as any).context

  testGlobals.forEach((item) => global[item] = TestGlobalsCache[item])
  TestGlobalsCache = {}
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
export const clearTestResults = (result:TPlayerTestEvent) => {
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


