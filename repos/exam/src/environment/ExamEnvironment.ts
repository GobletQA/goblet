import type {
  IExEnvironment,
  TEnvironmentCfg,
  TEnvironmentOpts,
} from '@GEX/types'

import { deepMerge, emptyObj } from '@keg-hub/jsutils'

export class ExamEnvironment implements IExEnvironment {

  options:TEnvironmentOpts = {
    envs: {}
  }

  constructor(cfg:TEnvironmentCfg=emptyObj){
    this.options = deepMerge(this.options, cfg.options)
  }

  setupGlobals = (...args:any[]) => {
    return undefined
  }

  resetGlobals = () => {
    return undefined
  }

  cleanup = (...args:any[]) => {
    return undefined
  }

}











