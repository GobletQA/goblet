import type {
  TExCtx,
  IExEnvironment,
  TEnvironmentEnvs,
  TExEnvironmentCfg,
  TEnvironmentCache,
} from '@GEX/types'

/**
 * This is needed so that expect is added to the global context
 * Which allows it to be referenced directly in step definitions
 */
import expect from 'expect'
import { emptyObj } from '@keg-hub/jsutils'
import { BaseRunner } from '@GEX/runner/BaseRunner'

export class BaseEnvironment implements IExEnvironment<BaseRunner> {

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

  constructor(cfg:TExEnvironmentCfg=emptyObj){}

  setup = (runner:BaseRunner, ctx:TExCtx) => {
    this.cache.globals.expect = (global as any).expect
    ;(global as any).expect = expect

    this.globals?.forEach((item) => {
      this.cache.globals[item] = global[item]
      global[item] = runner.test[item]
    })
  }

  reset = (runner:BaseRunner) => {
    ;(global as any).expect = this.cache.globals.expect

    this.globals?.forEach((item) => global[item] = this.cache.globals[item])
  }

  cleanup = (runner:BaseRunner) => {
    this.cache.globals = {}
    this.cache.envs = {}

    return undefined
  }

}
