import type { Player } from './player'
import type { TFeatureAst } from '@ltipton/parkin'
import type { TPlayerTestEvent, TPlayerTestMeta } from '@gobletqa/shared/types'

import { PWPlay } from '@GSC/constants'
import { Parkin } from '@ltipton/parkin'
import { emptyObj } from '@keg-hub/jsutils'
import { ParkinTest } from '@ltipton/parkin/test'

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

    if(result.failed){
      this.cancel()

      throw new Error(
        result?.failedExpectations?.[0]?.message || `Spec Failed`
      )
    }
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
