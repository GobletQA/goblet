import type { Player } from './player'
import type { TFeatureAst } from '@ltipton/parkin'
import type { TPlayerEvent, TPlayerEventData } from '@gobletqa/shared/types'

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
  globalTimeout?:number
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
  globalTimeout?: number

  constructor(player:Player, opts?:TCodeRunnerOpts) {
    this.player = player
    if(opts?.debug) this.debug = opts.debug
    if(opts?.slowMo) this.slowMo = opts.slowMo
    if(opts?.timeout) this.timeout = opts.timeout
    
    // Global Timeout gets passed to Parkin Test as the overall test timeout
    // So all tests must finish before this timeout
    if(opts?.globalTimeout) this.globalTimeout = opts.globalTimeout

    this.PTE = setupGlobals(this)

  }

  /**
   * Runs the code passed to it via the player
   */
  run = async (content:RunContent) => {
    this.PK = await setupParkin(this)

    // Timeout gets passed as last argument to test() method of global test method 
    await this.PK.run(content, {
      tags: {},
      timeout: this.timeout,
      steps: {
        shared: {
          // The player.id is actually the socket ID of the use who started the tests
          playerId: this.player.id
        }
      },
    })

    const results = await this.PTE.run() as TPlayerEventData[]

    // We only support 1 feature per file, so we only care about the first test result 
    const final = clearTestResults(results[0])
    await this.cleanup()

    return this.canceled ? emptyObj as TPlayerEventData : final
  }

  onSpecDone = (result:TPlayerEventData) => {

    if(this.canceled) return

    this.player.fireEvent({
      name: PWPlay.playSpecDone,
      message: `Player - Spec Done`,
      // Includes the `failedExpectations` data so we have access to the error messages
      data: {
        ...clearTestResults(result),
        failedExpectations: result?.failedExpectations
      },
    } as TPlayerEvent)

    if(result.failed){
      this.cancel()
      throw new Error(result?.failedExpectations?.[0]?.description || `Spec Failed`)
    }
  }

  onSuiteDone = (result:TPlayerEventData) => {
    cleanupWorld(this.PK)
    if(this.canceled) return

    this.player.fireEvent({
      name: PWPlay.playSuiteDone,
      data: clearTestResults(result),
      message: `Player - Suite Done`,
    })
  }

  onSpecStarted = (result:TPlayerEventData) => {
    if(this.canceled) return

    this.player.fireEvent({
      name: PWPlay.playSpecStart,
      data: clearTestResults(result),
      message: `Player - Spec Start`,
    })
  }

  onSuiteStarted = (result:TPlayerEventData) => {
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
