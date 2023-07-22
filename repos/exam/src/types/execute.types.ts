import type { Exam } from "@GEX/exam"
import type { TFileModel } from "@gobletqa/shared"
import type { IConstructable } from './helpers.types'
import type { TRunnerCls, IExRunner } from './runner.types'
import type { TTransformCls, IExTransform } from './transformer.types'
import type { TEnvironmentCls, IExEnvironment } from './environment.types'

export type TExData = Record<string, any>

export type TExecuteOptions = {
  slowMo?:number
  debug?:boolean
  verbose?:boolean
  timeout?:number
  globalTimeout?:number
  [key:string]: any
}

export type TExecuteTransformers = {
  [key:string]: TTransformCls
}

export type TExecuteRunners = {
  [key:string]: TRunnerCls
}

export type TExecuteEnvironments = {
  [key:string]: TEnvironmentCls
}

export type TExecuteBuiltRunners = Record<string, IExRunner>
export type TExecuteBuiltTransforms = Record<string, IExTransform>
export type TExecuteBuiltEnvironments = Record<string, IExEnvironment>

export type TExecuteCfg = {
  exam:Exam
  options:TExecuteOptions
  runners?:TExecuteRunners
  transformers?:TExecuteTransformers
  environments?:TExecuteEnvironments
}

export type TExRun<T extends TExData=TExData> = {
  loc?:string
  type?:string
  content?:string
  file?:TFileModel
  runner?:IConstructable<IExRunner>
  transform?:IConstructable<IExTransform>
  environment?:IConstructable<IExEnvironment>
  data?: T
}

export type TExResolveOpts<T extends TExData=TExData> = TExecuteOptions
  & TExRun<T>
  & {
    exam:Exam
  }

export type TExCtx<T extends TExData=TExData> = TExecuteOptions
  & Omit<TExResolveOpts<T>, `runner`|`transform`|`environment`>
  & {
    exam:Exam
    transform?:IExTransform
    environment:IExEnvironment
  }
