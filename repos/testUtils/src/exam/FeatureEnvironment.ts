import type {
  TExCtx,
  TEnvironmentEnvs,
  TExEnvironmentCfg,
  TEnvironmentCache,
  IExamEnvironment,
} from '@gobletqa/exam/types'
import type { FeatureRunner } from './FeatureRunner'

/**
 * This is needed so that expect is added to the global context
 * Which allows it to be referenced directly in step definitions
 */
import expect from 'expect'
import { emptyObj } from '@keg-hub/jsutils'

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

  constructor(cfg:TExEnvironmentCfg=emptyObj){

    Object.entries(cfg.globals)?.forEach(([key, item]) => {
      this.cache.globals[key] = global[key]
      global[key] = item
    })

    Object.entries(cfg.envs)?.forEach(([key, val]) => {
      this.cache.envs[key] = process.env[key]
      process.env[key] = val as string
    })

  }

  setup = (runner:FeatureRunner, ctx:TExCtx) => {
    this.cache.globals.expect = (global as any).expect
    ;(global as any).expect = expect

    this.globals?.forEach((item) => {
      this.cache.globals[item] = global[item]
      global[item] = runner.test[item]
    })
  }

  reset = (runner:FeatureRunner) => {
    ;(global as any).expect = this.cache.globals.expect

    this.globals?.forEach((item) => global[item] = this.cache.globals[item])
    
    Object.entries(this.cache.envs)?.forEach(([key, val]) => {
      process.env[key] = this.cache.envs[key]
    })
    
  }

  cleanup = (runner:FeatureRunner) => {
    this.cache.globals = {}
    this.cache.envs = {}

    return undefined
  }

}

export default FeatureEnvironment