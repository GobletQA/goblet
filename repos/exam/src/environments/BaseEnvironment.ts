import type {
  IEnvironment,
  TEnvironmentCfg,
  TEnvironmentOpts,
} from '@GEX/types'

import { Errors } from '@GEX/constants/errors'
import { deepMerge, emptyObj } from '@keg-hub/jsutils'

export class BaseEnvironment implements IEnvironment {

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











