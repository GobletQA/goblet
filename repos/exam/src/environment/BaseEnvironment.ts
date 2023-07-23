import type {
  TExCtx,
  IExEnvironment,
  TEnvironmentCfg,
  TEnvironmentOpts,
  TEnvironmentCache,
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

  options:TEnvironmentOpts = {
    envs: {
      EXAM_ENV: true
    }
  }

  cache:TEnvironmentCache = {
    globals: {},
    processEnvs:{},
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

  constructor(cfg:TEnvironmentCfg=emptyObj){
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
    
    // TODO: investigate overwriting all envs
    Object.entries(this.options.envs)
      .forEach(([key, val]) => {
        this.cache.processEnvs[key] = process.env[key]
        process.env[key] = `${val}`
      })

    return PTE
  }

  resetGlobals = () => {
    ;(global as any).expect = this.cache.globals.expect

    this.testGlobals.forEach((item) => global[item] = this.cache.globals[item])
    
    // TODO: investigate overwriting all envs
    Object.entries(this.options.envs)
      .forEach(([key, val]) => {
        process.env[key] = this.cache.processEnvs[key]
      })

    this.cache.globals = {}
    this.cache.processEnvs = {}
  }

  cleanup = (...args:any[]) => {
    return undefined
  }

}
