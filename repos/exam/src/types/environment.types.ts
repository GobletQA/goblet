import { IRunner } from './runner.types'
import { IConstructable } from './helpers.types'
import {BaseRunner} from '@GEX/runners/BaseRunner'

export type TEnvironmentEnvVal = string|number|boolean|undefined|null

export type TEnvironmentEnvs = {
  GOBLET_RUN_FROM_UI:TEnvironmentEnvVal
  GOBLET_RUN_FROM_CI:TEnvironmentEnvVal
  [key:string]:TEnvironmentEnvVal
}

export type TEnvironmentCache = {
  testGlobals: Record<string, any>
  processEnvs: Record<string, string>
}

export type TEnvironmentOpts = {
  envs?:Record<string, string|number|boolean|undefined|null>
}


export type TEnvironmentCfg = {
  testGlobals?:string[]
  worldSavePaths?:string[]
  omitTestResults?:string[]
  options?:TEnvironmentOpts
}


export interface IBaseEnvironment {
  options:TEnvironmentOpts
  setupGlobals(...args:any[]):void|Promise<void>
  resetGlobals(...args:any[]):void|Promise<void>
  cleanup(runner:IRunner<BaseRunner>, ...args:any[]):void|Promise<void>
}

export type IEnvironment<I extends IBaseEnvironment=IBaseEnvironment> = I & IBaseEnvironment

export type TEnvironmentCls = IConstructable<IEnvironment>
