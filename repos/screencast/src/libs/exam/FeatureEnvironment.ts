import type * as Parkin from '@ltipton/parkin'
import type {
  TEnvironmentEnvs,
  TEnvironmentCache,
  IExamEnvironment,
  TExEnvironmentCfg,
  TExCtx,
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

export class FeatureEnvironment implements IExamEnvironment<FeatureRunner> {

  envs:TEnvironmentEnvs={}
  cache:TEnvironmentCache = {
    envs:{},
    globals: {},
  }

  globals:string[] = [
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


  options = {
    envs: {
      GOBLET_RUN_FROM_UI: `1`,
      GOBLET_RUN_FROM_CI: undefined
    }
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

  constructor(cfg:TExEnvironmentCfg=emptyObj){}

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

    this.globals.forEach((item) => {
      this.cache.globals[item] = global[item]
      global[item] = PTE[item]
    })
    
    // TODO: investigate overwriting all envs
    Object.entries(this.options.envs)
      .forEach(([key, val]) => {
        this.cache.envs[key] = process.env[key]
        process.env[key] = `${val}`
      })

    return PTE
  }

  /**
  * Sets up the global variables so they can be accesses in step definitions
  * Caches any existing globals so they can be reset after the test run
  * This ensures it doesn't clobber what ever already exists
  */
  setup = (runner:FeatureRunner, ctx: TExCtx) => {
    this.cache.globals.page = (global as any).page
    this.cache.globals.expect = (global as any).expect
    this.cache.globals.context = (global as any).context
    this.cache.globals.browser = (global as any).browser

    ;(global as any).expect = expect
    // TODO: FIX ME
    // global.page = runner.exam.page
    // global.browser = runner.exam.browser
    // global.context = runner.exam.context
    return this.setTestGlobals(runner, runner.timeout)
  }

  /**
  * Uses the global test cache that was created in setupGlobals to reset their value
  * This ensures it doesn't clobber what ever already exists
  */
  reset = () => {
    ;(global as any).page = this.cache.globals.page
    ;(global as any).expect = this.cache.globals.expect
    ;(global as any).context = this.cache.globals.context
    ;(global as any).browser = this.cache.globals.browser

    this.globals.forEach((item) => global[item] = this.cache.globals[item])
    
    // TODO: investigate overwriting all envs
    Object.entries(this.options.envs)
      .forEach(([key, val]) => {
        process.env[key] = this.cache.envs[key]
      })

    this.cache.globals = {}
    this.cache.envs = {}
  }

  /**
  * Sets up Parkin globally, so it can be accessed by step definitions
  * Tries to use the existing Parkin instance on the Runner class
  */
  setupParkin = async (runner:FeatureRunner) => {
    // TODO: FIX ME
    const PK = runner?.repo?.parkin
    if(!PK) throw new Error(`Repo is missing a parkin instance`)

    // TODO: FIX ME
    await getDefinitions(runner?.repo, undefined, false)
    return PK
  }

  /**
   * It should auto-clean up the world object after each spec
   */
  cleanup = (runner: FeatureRunner) => {
    this.worldSavePaths.forEach(loc => unset(runner.test?.world, loc))
  }

}











