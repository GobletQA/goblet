import { IExamRunner, IExRunner } from './runner.types'
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

// TODO: fix this to use a real serializable values
export type TSerializeObj = Record<any, any>

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

export interface IExamEnvironment<R extends ExamRunner=ExamRunner> {
  globals?:TSerializeObj
  envs?:Record<string, TEnvironmentEnvVal>
  setup(runner:R, ctx:TExCtx):void|Promise<void>
  reset(runner:R):void|Promise<void>
  cleanup(runner:R):void|Promise<void>
}

export type IExEnvironment<
  E extends IExamEnvironment,
  R extends ExamRunner
> = E & IExamEnvironment<R>
export type TEnvironmentCls<
  E extends IExamEnvironment,
  R extends ExamRunner
> = IConstructable<IExEnvironment<E, R>>
