import type {
  TSerializeObj,
  IExEnvironment,
  TEnvironmentEnvs,
  TExEnvironmentCfg,
  TEnvironmentCache,
} from '@GEX/types'

import { isStr } from '@keg-hub/jsutils'

export class ExamEnvironment implements IExEnvironment {

  globals:TSerializeObj={}
  envs:TEnvironmentEnvs={}

  cache:TEnvironmentCache = {
    envs:{},
    globals: {},
  }

  constructor(cfg:TExEnvironmentCfg){
    this.envs = {...cfg.envs, EXAM_ENV: true }
    this.globals = {...cfg.globals}
  }

  setup = async () => {

    Object.entries(this.globals).forEach(([key, val]) => {
      this.cache.globals[key] = global[key]
      global[key] = val
    })

    Object.entries(this.envs).forEach(([key, val]) => {
      this.cache.envs[key] = process.env[key]
      process.env[key] = isStr(val) ? val : JSON.stringify(val)
    })

  }

  reset = async () => {
    Object.entries(this.cache.globals)
      .forEach(([key, val]) => global[key] = val)

    Object.entries(this.cache.envs)
      .forEach(([key, val]) => process.env[key] = this.cache.envs[key])
  }

  cleanup = async () => {
    this.envs = undefined
    this.envs = {}

    this.globals = undefined
    this.globals = {}

    this.cache = undefined
    this.cache = {envs: {}, globals: {}}
  }

}











