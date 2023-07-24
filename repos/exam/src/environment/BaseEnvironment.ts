import type {
  TExCtx,
  IExEnvironment,
  TExEnvironmentCfg,
  TEnvironmentOpts,
  TEnvironmentCache,
  TEnvironmentEnvs,
} from '@GEX/types'

/**
 * This is needed so that expect is added to the global context
 * Which allows it to be referenced directly in step definitions
 */
import expect from 'expect'
import { ParkinTest } from '@ltipton/parkin/test'
import { BaseRunner } from '@GEX/runner/BaseRunner'
import { TParkinTestConfig } from '@ltipton/parkin'
import { deepMerge, emptyObj } from '@keg-hub/jsutils'

export class BaseEnvironment implements IExEnvironment<BaseRunner> {

  envs:TEnvironmentEnvs={}
  options:TEnvironmentOpts = {}
  cache:TEnvironmentCache = {
    envs:{},
    globals: {},
  }

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

  constructor(cfg:TExEnvironmentCfg=emptyObj){
    this.options = deepMerge(this.options, cfg.options)
  }

  setupGlobals = (runner:BaseRunner, ctx:TExCtx) => {
    const { data } = ctx

    this.cache.globals.expect = (global as any).expect
    ;(global as any).expect = expect

    const opts:TParkinTestConfig = {
      specDone: runner.onSpecDone,
      suiteDone: runner.onSuiteDone,
      specStarted: runner.onSpecStarted,
      suiteStarted: runner.onSuiteStarted,
    }

    const tOut = data?.timeout || runner.globalTimeout
    tOut && (opts.timeout = tOut)

    const PTE = new ParkinTest(opts)

    this.testGlobals.forEach((item) => {
      this.cache.globals[item] = global[item]
      global[item] = PTE[item]
    })

    return PTE
  }

  resetGlobals = (runner:BaseRunner) => {
    ;(global as any).expect = this.cache.globals.expect

    this.testGlobals.forEach((item) => global[item] = this.cache.globals[item])
  }

  cleanup = (runner:BaseRunner) => {
    this.cache.globals = {}
    this.cache.envs = {}

    return undefined
  }

}
