import type {
  TExCtx,
  TEnvironmentEnvs,
  TExEnvironmentCfg,
  TEnvironmentCache,
  IExamEnvironment,
} from '@GEX/types'

/**
 * This is needed so that expect is added to the global context
 * Which allows it to be referenced directly in step definitions
 */
import expect from 'expect'
import { isStr } from '@keg-hub/jsutils/isStr'
import { ParkinTest } from '@ltipton/parkin/test'
import { BaseRunner } from '@GEX/runner/BaseRunner'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'

export class BaseEnvironment implements IExamEnvironment<BaseRunner> {

  test:ParkinTest
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

  constructor(cfg:TExEnvironmentCfg=emptyObj){
    
    Object.entries(cfg.globals)?.forEach(([key, item]) => {
      this.cache.globals[key] = global[key]
      global[key] = item
    })

    Object.entries(cfg.envs)?.forEach(([key, val]) => {
      this.cache.envs[key] = process.env[key]
      process.env[key] = isStr(val) ? val : JSON.stringify(val)
    })
    
    this.test = new ParkinTest()
  }

  setup = (runner:BaseRunner) => {
    this.cache.globals.expect = (global as any).expect
    ;(global as any).expect = expect

    this.globals?.forEach((item) => {
      this.cache.globals[item] = global[item]
      global[item] = this.test[item]
    })

    this.test.setConfig({
      testTimeout: runner?.testTimeout,
      suiteTimeout: runner?.suiteTimeout,
      onSpecDone: runner.onSpecDone.bind(runner),
      onSuiteDone: runner.onSuiteDone.bind(runner),
      onSpecStart: runner.onSpecStart.bind(runner),
      onSuiteStart: runner.onSuiteStart.bind(runner),
    })

  }

  reset = () => {
    ;(global as any).expect = this.cache.globals.expect

    this.globals?.forEach((item) => global[item] = this.cache.globals[item])
    
    Object.entries(this.cache.envs)?.forEach(([key, val]) => {
      process.env[key] = this.cache.envs[key]
    })
    
  }

  cleanup = () => {
    this.cache.globals = {}
    this.cache.envs = {}
    this?.test?.clean?.()

    return undefined
  }

}

export default BaseEnvironment
