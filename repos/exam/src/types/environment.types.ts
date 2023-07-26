import { IExRunner } from './runner.types'
import { IConstructable } from './helpers.types'
import { ExamRunner } from '@GEX/runner/ExamRunner'
import {TExCtx} from './execute.types'

export type TEnvironmentEnvVal = string
  |number
  |boolean
  |undefined
  |null
  |string[]
  |number[]
  |boolean[]
  |undefined[]
  |null[]

type TRecordRef<T=TEnvironmentEnvVal> = TEnvironmentEnvVal
  | TEnvironmentEnvVal[]
  | Record<string, TEnvironmentEnvVal>
  | Record<string, TEnvironmentEnvVal>[]
  | Record<string, T>
  | Record<string, T>[]
  | T
  | T[]

export type TEnvironmentEnvArr = Array<TRecordRef<TRecordRef<TRecordRef>>>
export type TEnvironmentEnvObj = TRecordRef<TRecordRef<TRecordRef>>

export type TSerializeObj = Record<string, TEnvironmentEnvObj|TEnvironmentEnvArr>

export type TEnvironmentEnvs = {
  [key:string]:TEnvironmentEnvVal
}

export type TEnvironmentCache = {
  globals: Record<string, any>
  envs: Record<string, string>
}


export type TExEnvironmentCfg = {
  globals?:TSerializeObj
  envs?:Record<string, TEnvironmentEnvVal>
}

export interface IExamEnvironment<R=ExamRunner> {
  globals?:TSerializeObj
  envs?:Record<string, TEnvironmentEnvVal>

  setup(runner:IExRunner<R>, ctx:TExCtx):void|Promise<void>
  reset(runner:IExRunner<R>):void|Promise<void>
  cleanup(runner:IExRunner<R>):void|Promise<void>
}

export type IExEnvironment<
  R extends ExamRunner=ExamRunner,
  I extends IExamEnvironment<R>=IExamEnvironment<R>
> = I & IExamEnvironment<R>

export type TEnvironmentCls<
  R extends ExamRunner=ExamRunner,
  I extends IExamEnvironment<R>=IExamEnvironment<R>
> = IConstructable<IExEnvironment<R, I>>
