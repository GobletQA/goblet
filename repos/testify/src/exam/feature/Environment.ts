import type {
  TEnvironmentEnvs,
  TExEnvironmentCfg,
  TEnvironmentCache,
  IExamEnvironment,
} from '@gobletqa/exam/types'
import type { FeatureRunner } from './Runner'

/**
 * This is needed so that expect is added to the global context
 * Which allows it to be referenced directly in step definitions
 */
// TODO this works but should be better
// @ts-ignore
// import path from 'node:path'
// import { expect } from 'playwright/lib/common/expectBundle.js'
// const { expect } = require(path.join(require.resolve('playwright').split('/').slice(0, -1).join('/').trim(), '/lib/common/expectBundle.js'))

import expect from 'expect'

import { ParkinTest } from '@ltipton/parkin/test'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { Parkin, TParkinRunOpts } from '@ltipton/parkin'

type TFeatureEnvironment = TExEnvironmentCfg<{ parkin?: Record<string, any> }>

export class FeatureEnvironment implements IExamEnvironment {

  parkin:Parkin
  test:ParkinTest
  runOptions:TParkinRunOpts={}
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

  constructor(cfg:TFeatureEnvironment=emptyObj){

    Object.entries(cfg.globals)?.forEach(([key, item]) => {
      this.cache.globals[key] = global[key]
      global[key] = item
    })

    Object.entries(cfg.envs)?.forEach(([key, val]) => {
      this.cache.envs[key] = process.env[key]
      process.env[key] = val as string
    })

    this.parkin = global.getParkinInstance(cfg.globals?.__goblet?.config)
    this.test = new ParkinTest()
    this.runOptions = cfg?.parkin?.run

  }

  setup = (runner:FeatureRunner) => {
    this.cache.globals.expect = (global as any).expect
    ;(global as any).expect = expect

    this.globals?.forEach((item) => {
      this.cache.globals[item] = global[item]
      global[item] = this.test[item]
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
    this.reset()

    this.cache.globals = {}
    this.cache.envs = {}
    this?.test?.clean?.()
  }

}

export default FeatureEnvironment