import { IExRunner } from './runner.types'
import { IConstructable } from './helpers.types'
import { ExamRunner } from '@GEX/runner/ExamRunner'

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

interface IExamEnvironment<R=ExamRunner> {
  options:TEnvironmentOpts
  setupGlobals(...args:any[]):void|Promise<void>
  resetGlobals(...args:any[]):void|Promise<void>
  cleanup(runner:IExRunner<R>, ...args:any[]):void|Promise<void>
}

export type IExEnvironment<
  R extends ExamRunner=ExamRunner,
  I extends IExamEnvironment<R>=IExamEnvironment<R>
> = I & IExamEnvironment<R>

export type TEnvironmentCls<
  R extends ExamRunner=ExamRunner,
  I extends IExamEnvironment<R>=IExamEnvironment<R>
> = IConstructable<IExEnvironment<R, I>>
