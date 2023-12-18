import type { Player } from './player'
import type { TPlayerEvent, TPlayerEventData } from '@GBB/types'
import type { TFeatureAst, TParkinRunStepOptsMap } from '@ltipton/parkin'

import { Parkin } from '@ltipton/parkin'
import { Logger } from '@gobletqa/logger'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { ParkinTest } from '@ltipton/parkin/test'
import { TestsToSocketEvtMap } from '@gobletqa/environment/constants'
import {
  setupParkin,
  setupGlobals,
  cleanupWorld,
  resetTestGlobals,
  clearTestResults,
} from './setup'

type RunContent = string | string[] | TFeatureAst | TFeatureAst[]

export type TCodeRunnerOpts = {
  debug?: boolean
  slowMo?: number
  timeout?: number
  suiteTimeout?:number
}

// const util = require('util')
// console.log(util.inspect(this.PTE.getActiveParent(), {showHidden: false, depth: null, colors: true}))
// console.log(util.inspect(content, {showHidden: false, depth: null, colors: true}))

class CodeRunError extends Error {
  constructor(message:string) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
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
  debug?:boolean
  slowMo?:number
  timeout:number=15000
  suiteTimeout?:number

  constructor(player:Player, opts?:TCodeRunnerOpts) {
    this.player = player
    if(opts?.debug) this.debug = opts.debug
    if(opts?.slowMo) this.slowMo = opts.slowMo
    if(opts?.timeout) this.timeout = opts.timeout
    
    // Global Timeout gets passed to Parkin Test as the overall test timeout
    // So all tests must finish before this timeout
    if(opts?.suiteTimeout) this.suiteTimeout = opts.suiteTimeout

  }

  /**
   * Runs the code passed to it via the player
   */
  run = async (content:RunContent, steps?:TParkinRunStepOptsMap) => {
    this.PTE = setupGlobals(this)
    this.PK = await setupParkin(this)

    await this.PK.run(content, {
      tags: {},
      steps: steps,
    })

    const results = await this.PTE.run() as TPlayerEventData[]
    const final = clearTestResults(results[0])
    if(this.canceled) return emptyObj as TPlayerEventData

    await this.cleanup()
    return final
  }

  onSpecDone = (result:TPlayerEventData) => {

    if(this.canceled) return

    this.player.fireEvent({
      name: TestsToSocketEvtMap.specDone,
      message: `Player - Spec Done`,
      // Includes the `failedExpectations` data so we have access to the error messages
      data: {
        ...clearTestResults(result),
        failedExpectations: result?.failedExpectations
      },
    } as TPlayerEvent)

    if(result.failed){
      this.cancel()

      const failed = result?.failedExpectations?.[0]
      if(!failed){
        Logger.empty()
        Logger.warn(`------------- WARNING -----------`)
        Logger.warn(`Missing failed expectation in failed Parkin test.`)
        Logger.data(result)
        Logger.log(`------------- WARNING -----------`)
        Logger.empty()

        throw new CodeRunError(`Spec Failed`)
      }

      Logger.empty()
      Logger.error(`Test Run Error - failed expectation error stack`)
      Logger.log(failed.error.stack)
      Logger.empty()

      throw new CodeRunError(failed.description)
    }
  }

  onSuiteDone = (result:TPlayerEventData) => {
    cleanupWorld(this.PK)
    if(this.canceled) return

    this.player.fireEvent({
      name: TestsToSocketEvtMap.suiteDone,
      data: clearTestResults(result),
      message: `Player - Suite Done`,
    })
  }

  onSpecStart = (result:TPlayerEventData) => {
    if(this.canceled) return

    this.player.fireEvent({
      name: TestsToSocketEvtMap.specStart,
      data: clearTestResults(result),
      message: `Player - Spec Start`,
    })
  }

  onSuiteStart = (result:TPlayerEventData) => {
    if(this.canceled) return

    this.player.fireEvent({
      name: TestsToSocketEvtMap.suiteStart,
      data: clearTestResults(result),
      message: `Player - Suite Start`,
    })
  }

  cancel = async () => {
    this.canceled = true
    this.PTE?.abort?.()
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
