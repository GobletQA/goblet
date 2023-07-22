import type { Exam } from "@GEX/exam"
import type { TFileModel } from "@gobletqa/shared"
import type { IConstructable } from './helpers.types'
import type { TRunnerCls, IRunner } from './runner.types'
import type { TTransformCls, ITransform } from './transformer.types'
import type { TEnvironmentCls, IEnvironment } from './environment.types'


export type TExecuteOptions = {
  slowMo?:number
  debug?:boolean
  verbose?:boolean
  timeout?:number
  globalTimeout?:number
  [key:string]: any
}

export type TExecTransformers = {
  [key:string]: TTransformCls
}

export type TExecRunners = {
  [key:string]: TRunnerCls
}

export type TExecEnvironments = {
  [key:string]: TEnvironmentCls
}

export type TExecBuiltRunners = Record<string, IRunner>
export type TExecBuiltTransforms = Record<string, ITransform>
export type TExecBuiltEnvironments = Record<string, IEnvironment>

export type TExecuteCfg = {
  exam:Exam
  runners?:TExecRunners
  options:TExecuteOptions
  transformers?:TExecTransformers
  environments?:TExecEnvironments
}

export type TExecRun<T extends Record<string, any>=Record<string, any>> = {
  loc?:string
  type?:string
  content?:string
  file?:TFileModel
  runner?:IConstructable<IRunner>
  transform?:IConstructable<ITransform>
  environment?:IConstructable<IEnvironment>
  data?: T
}

export type TExecCtx<T extends Record<string, any>=Record<string, any>> = TExecRun<T> & TExecuteOptions & {
  exam:Exam
}