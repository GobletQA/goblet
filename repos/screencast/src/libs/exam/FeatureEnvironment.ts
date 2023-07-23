import type * as Parkin from '@ltipton/parkin'
import type {
  IExEnvironment,
  TEnvironmentCfg,
  TEnvironmentOpts,
  TEnvironmentCache,
} from "@gobletqa/exam"
import type {
  FeatureRunner,
} from './FeatureRunner'


/**
 * This is needed so that expect is added to the global context
 * Which allows it to be referenced directly in step definitions
 */
import expect from 'expect'
import { ParkinTest } from '@ltipton/parkin/test'
import { unset, emptyObj } from '@keg-hub/jsutils'
import { TParkinTestConfig } from '@ltipton/parkin'
import { getDefinitions } from '@gobletqa/workflows'
import {
  SavedDataWorldPath,
  AutoSavedDataWorldPath,
  SavedLocatorWorldPath,
  AutoSavedLocatorWorldPath,
} from '@gobletqa/shared/constants'

export class FeatureEnvironment implements IExEnvironment<FeatureRunner> {

  options:TEnvironmentOpts = {
    envs: {
      GOBLET_RUN_FROM_UI: `1`,
      GOBLET_RUN_FROM_CI: undefined
    }
  }
  
  cache:TEnvironmentCache = {
    processEnvs:{},
    testGlobals:{}
  }

  /**
  * ------ TODO: Move this to parkin ------ *
  * It should auto-clean up the world object after each spec
  */
  worldSavePaths:string[] = [
    SavedDataWorldPath,
    AutoSavedDataWorldPath,
    SavedLocatorWorldPath,
    AutoSavedLocatorWorldPath,
  ]

  testGlobals:string[] = [
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

  constructor(cfg:TEnvironmentCfg=emptyObj){
    if(cfg.testGlobals)
      this.testGlobals = [...this.testGlobals, ...cfg.testGlobals]

    if(cfg.worldSavePaths)
      this.worldSavePaths = [...this.worldSavePaths, ...cfg.worldSavePaths]

  }

  /**
  * Use custom test runner from parkin
  * Jest does not allow calling from the Node directly
  * So we use Parkin's test runner instead
  */
  setTestGlobals = (runner:FeatureRunner, timeout?:number) => {
    const opts:TParkinTestConfig = {
      specDone: runner.onSpecDone,
      suiteDone: runner.onSuiteDone,
      specStarted: runner.onSpecStarted,
      suiteStarted: runner.onSuiteStarted,
    }

    const tOut = timeout || runner.globalTimeout
    tOut && (opts.timeout = tOut)

    const PTE = new ParkinTest(opts)

    this.testGlobals.forEach((item) => {
      this.cache.testGlobals[item] = global[item]
      global[item] = PTE[item]
    })
    
    // TODO: investigate overwriting all envs
    Object.entries(this.options.envs)
      .forEach(([key, val]) => {
        this.cache.processEnvs[key] = process.env[key]
        process.env[key] = `${val}`
      })

    return PTE
  }

  /**
  * Sets up the global variables so they can be accesses in step definitions
  * Caches any existing globals so they can be reset after the test run
  * This ensures it doesn't clobber what ever already exists
  */
  setupGlobals = (runner:FeatureRunner, timeout?:number) => {
    this.cache.testGlobals.page = (global as any).page
    this.cache.testGlobals.expect = (global as any).expect
    this.cache.testGlobals.context = (global as any).context
    this.cache.testGlobals.browser = (global as any).browser

    ;(global as any).expect = expect
    // TODO: FIX ME
    // global.page = runner.exam.page
    // global.browser = runner.exam.browser
    // global.context = runner.exam.context
    return this.setTestGlobals(runner, timeout)
  }

  /**
  * Uses the global test cache that was created in setupGlobals to reset their value
  * This ensures it doesn't clobber what ever already exists
  */
  resetGlobals = () => {
    ;(global as any).page = this.cache.testGlobals.page
    ;(global as any).expect = this.cache.testGlobals.expect
    ;(global as any).context = this.cache.testGlobals.context
    ;(global as any).browser = this.cache.testGlobals.browser

    this.testGlobals.forEach((item) => global[item] = this.cache.testGlobals[item])
    
    // TODO: investigate overwriting all envs
    Object.entries(this.options.envs)
      .forEach(([key, val]) => {
        process.env[key] = this.cache.processEnvs[key]
      })

    this.cache.testGlobals = {}
    this.cache.processEnvs = {}
  }

  /**
  * Sets up Parkin globally, so it can be accessed by step definitions
  * Tries to use the existing Parkin instance on the Runner class
  */
  setupParkin = async (runner:FeatureRunner) => {
    // TODO: FIX ME
    const PK = runner?.exam?.repo?.parkin
    if(!PK) throw new Error(`Repo is missing a parkin instance`)

    // TODO: FIX ME
    await getDefinitions(runner?.exam?.repo, undefined, false)
    return PK
  }

  /**
   * It should auto-clean up the world object after each spec
   */
  cleanup = (runner:FeatureRunner) => {
    this.worldSavePaths.forEach(loc => unset(runner.PK?.world, loc))
  }

}











