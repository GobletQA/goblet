import type { Player } from './player'

// TODO( IMPORTANT ):  @lancetipton - Setup mv2
// const { NodeVM } = require('vm2')
import expect from 'expect'
import { constants } from './constants'
import { Parkin } from '@ltipton/parkin'
import { ParkinTest } from '@ltipton/parkin/test'
import { getDefinitions } from '@gobletqa/shared/repo/getDefinitions'


/**
 * Use custom test runner from parkin
 * Jest does not allow calling from the Node directly
 * So we use Parkin's test runner instead
 */
const setTestGlobals = (Runner:CodeRunner) => {

  const PTE = new ParkinTest({
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

  await getDefinitions(Runner?.player?.repo)
  return PK
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
  exec = undefined
  player:Player
  PK:Parkin
  PTE:ParkinTest
  

  constructor(player:Player) {
    this.player = player
    this.PTE = setupGlobals(this)
  }

  /**
   * Runs the code passed to it via the player
   */
  run = async (content) => {
    this.PK = await setupParkin(this)

    await this.PK.run(content)
    const results = await this.PTE.run()

    return results
  }

  onSpecDone = (result) => {
    this.player.fireEvent({
      data: result,
      message: 'Player - Spec Done',
      name: constants.playSuiteDone,
    })

    // TODO: probably don't want to throw here
    // Need to capture the spec, and skip to the next suite
    // Should be based on some config value
    if(result.failed)
      throw new Error(
        result?.failedExpectations?.[0]?.message || `Spec Failed`
      )
  }

  onSuiteDone = (result) => {
    this.player.fireEvent({
      data: result,
      message: 'Player - Suite Done',
      name: constants.playSuiteDone,
    })
  }

  onSpecStarted = (result) => {
    this.player.fireEvent({
      data: result,
      message: 'Player - Spec Start',
      name: constants.playSpecStart,
    })
  }

  onSuiteStarted = (result) => {
    this.player.fireEvent({
      data: result,
      message: 'Player - Suite Start',
      name: constants.playSuiteStart,
    })
  }

}