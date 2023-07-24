import type {
  TSerializeObj,
  IExEnvironment,
  TEnvironmentOpts,
  TEnvironmentEnvs,
  TExEnvironmentCfg,
  TEnvironmentCache,
} from '@GEX/types'

import { deepMerge, isStr } from '@keg-hub/jsutils'

export class ExamEnvironment implements IExEnvironment {

  globals:TSerializeObj={}
  envs:TEnvironmentEnvs={}
  
  options:TEnvironmentOpts = {}

  cache:TEnvironmentCache = {
    envs:{},
    globals: {},
  }

  constructor(cfg:TExEnvironmentCfg){
    this.envs = {...cfg.envs, EXAM_ENV: true }
    this.globals = {...cfg.globals}
    this.options = deepMerge(this.options, cfg.options)
  }

  setupGlobals = async () => {

    Object.entries(this.globals).forEach(([key, val]) => {
      this.cache.globals[key] = global[key]
      global[key] = val
    })

    Object.entries(this.envs).forEach(([key, val]) => {
      this.cache.envs[key] = process.env[key]
      process.env[key] = isStr(val) ? val : JSON.stringify(val)
    })

  }

  resetGlobals = async () => {
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
    
    this.options = undefined
    this.options = {}
  }

}











