import type { Player } from './player'
import type { TFeatureAst } from '@ltipton/parkin'

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
import { ParkinTest } from '@ltipton/parkin/test'
import { getDefinitions } from '@gobletqa/shared/repo/getDefinitions'


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

  global.it = PTE.it
  global.xit = PTE.xit
  global.test = PTE.test
  global.xtest = PTE.xtest
  global.describe = PTE.describe
  global.xdescribe = PTE.xdescribe
  global.afterAll = PTE.afterAll
  global.afterEach = PTE.afterEach
  global.beforeAll = PTE.beforeAll
  global.beforeEach = PTE.beforeEach

  return PTE
}

const setupGlobals = (Runner:CodeRunner) => {
  ;(global as any).expect = expect
  global.context = Runner.player.context
  return setTestGlobals(Runner)
}

const setupParkin = async (Runner:CodeRunner) => {
  const PK = Runner?.player?.repo?.parkin
  if(!PK) throw new Error(`Repo is missing a parkin instance`)

  await getDefinitions(Runner?.player?.repo, undefined, false)
  return PK
}

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
    const results = await this.PTE.run()

    return results
  }

  onSpecDone = (result) => {
    this.player.fireEvent({
      data: result,
      message: 'Player - Spec Done',
      name: PWPlay.playSpecDone,
    })

    // TODO: Update parkin to accept a failed event
    // Which will tell it to stop running tests
    if(result.failed)
      throw new Error(
        result?.failedExpectations?.[0]?.message || `Spec Failed`
      )
  }

  onSuiteDone = (result) => {
    this.player.fireEvent({
      data: result,
      message: 'Player - Suite Done',
      name: PWPlay.playSuiteDone,
    })
  }

  onSpecStarted = (result) => {
    this.player.fireEvent({
      data: result,
      message: 'Player - Spec Start',
      name: PWPlay.playSpecStart,
    })
  }

  onSuiteStarted = (result) => {
    this.player.fireEvent({
      data: result,
      message: 'Player - Suite Start',
      name: PWPlay.playSuiteStart,
    })
  }

}
