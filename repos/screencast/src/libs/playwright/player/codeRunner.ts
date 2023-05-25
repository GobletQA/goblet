import type { Player } from './player'
import type { TFeatureAst } from '@ltipton/parkin'
import type { TPlayerTestEvent, TPlayerTestMeta } from '@gobletqa/shared/types'

import {
  SavedDataWorldPath,
  AutoSavedDataWorldPath,
  SavedLocatorWorldPath,
  AutoSavedLocatorWorldPath,
} from '@gobletqa/shared/constants'

type RunContent = string | string[] | TFeatureAst | TFeatureAst[]

/** --------- TODO --------- */
// IMPORTANT: Investigate setting up NodeVM
// Remember to add it to the package.json => "vm2": "3.9.9"
// const { NodeVM } = require('vm2')

// Investigate if this expect import is needed
import expect from 'expect'
 /** ------------------ */

import { PWPlay } from '@GSC/constants'
import { Parkin } from '@ltipton/parkin'
import { unset, omitKeys, emptyObj } from '@keg-hub/jsutils'
import { ParkinTest } from '@ltipton/parkin/test'
import { getDefinitions } from '@gobletqa/shared/repo/getDefinitions'


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
const setTestGlobals = (Runner:CodeRunner, timeout=6000) => {

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

const setupGlobals = (Runner:CodeRunner) => {
  ;(TestGlobalsCache as any).expect = (global as any).expect
  ;(TestGlobalsCache as any).context = (global as any).context

  ;(global as any).expect = expect
  global.context = Runner.player.context
  return setTestGlobals(Runner)
}

const resetTestGlobals = () => {
  ;(global as any).expect = (TestGlobalsCache as any).expect
  ;(global as any).context = (TestGlobalsCache as any).context

  testGlobals.forEach((item) => global[item] = TestGlobalsCache[item])
  TestGlobalsCache = {}
}


const setupParkin = async (Runner:CodeRunner) => {
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

const cleanupWorld = (PK:Parkin) => {
  worldSavePaths.forEach(loc => unset(PK?.world, loc))
}
/**
 * ------ END - TODO: Move this to parkin ------ *
 */

/**
 * ------ TODO: FIX ME ------ *
 * There's some world issue where some meta-data is being added to the passedExpectations object
 * Need to investigate why, this is a work around until it's fixed
 * But will most likely leave this, because the frontend does not need it
 */
const clearTestResults = (result:TPlayerTestMeta) => {
  // TODO: fix the 'TPlayerTestEvent' type, it's wrong
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
/**
 * ------ END - TODO: FIX ME ------ *
 */


export type TCodeRunnerOpts = {
  debug?: boolean
  slowMo?: number
  timeout?: number
}

/**
 * CodeRunner
 * Sets up the test environment to allow running tests in a secure context
 * Ensures the test methods exist on the global scope
 */
export class CodeRunner {

  /**
   * Player Class instance
   */
  PK:Parkin
  player:Player
  PTE:ParkinTest
  exec = undefined
  canceled:boolean

  /**
   * Custom options for each run of the code
   */
  debug?: boolean
  slowMo?: number
  timeout?: number

  constructor(player:Player, opts?:TCodeRunnerOpts) {
    this.player = player
    this.PTE = setupGlobals(this)
    
    // TODO: update options to impact how code runner executes code
    // Need way to pass timeout to step definitions
    if(opts?.debug) this.debug = opts.debug
    if(opts?.slowMo) this.slowMo = opts.slowMo
    if(opts?.timeout) this.timeout = opts.timeout

  }

  /**
   * Runs the code passed to it via the player
   */
  run = async (content:RunContent) => {
    this.PK = await setupParkin(this)

    await this.PK.run(content, {})
    const results = await this.PTE.run() as TPlayerTestEvent[]

    // We only support 1 feature per file, so we only care about the first test result 
    const final = clearTestResults(results[0])
    await this.cleanup()

    return this.canceled ? emptyObj as TPlayerTestEvent : final
  }

  onSpecDone = (result:TPlayerTestMeta) => {
    if(this.canceled) return
    
    this.player.fireEvent({
      name: PWPlay.playSpecDone,
      message: `Player - Spec Done`,
      // Includes the `failedExpectations` data so we have access to the error messages
      data: {...clearTestResults(result), failedExpectations: result?.failedExpectations},
    })

    // TODO: Update parkin to accept a failed event
    // Which will tell it to stop running tests
    if(result.failed)
      throw new Error(
        result?.failedExpectations?.[0]?.message || `Spec Failed`
      )
  }

  onSuiteDone = (result:TPlayerTestMeta) => {
    cleanupWorld(this.PK)
    if(this.canceled) return

    this.player.fireEvent({
      name: PWPlay.playSuiteDone,
      data: clearTestResults(result),
      message: `Player - Suite Done`,
    })
  }

  onSpecStarted = (result:TPlayerTestMeta) => {
    if(this.canceled) return

    this.player.fireEvent({
      name: PWPlay.playSpecStart,
      data: clearTestResults(result),
      message: `Player - Spec Start`,
    })
  }

  onSuiteStarted = (result:TPlayerTestMeta) => {
    if(this.canceled) return

    this.player.fireEvent({
      name: PWPlay.playSuiteStart,
      data: clearTestResults(result),
      message: `Player - Suite Start`,
    })
  }

  cancel = async () => {
    this.canceled = true
    this?.PK?.runner?.steps?.clear()
    this?.PK?.steps?.clear()

    await this.cleanup?.()
  }

  cleanup = async () => {
    cleanupWorld(this.PK)
    resetTestGlobals()
    this?.PTE?.clean()

    this.player = undefined
    this.PK = undefined
    this.PTE = undefined
  }

}
