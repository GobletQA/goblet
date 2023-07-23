import type { Exam } from "@GEX/Exam"
import type { TExArrClsOptMap } from './helpers.types'
import type {
  IExEnvironment,
  TEnvironmentCfg,
} from './environment.types'
import type {
  IExRunner,
  TExRunnerCfg,
} from './runner.types'
import type {
  IExTransform,
  TExTransformCfg,
} from './transformer.types'

import {
  TExecuteRunners,
  TExecuteEnvironments,
  TExecuteTransformers,
}  from './typeMaps.types'

export type TExData = Record<string, any>

export type TExecuteOptions = {
  debug?:boolean
  verbose?:boolean
  timeout?:number
  globalTimeout?:number
  [key:string]: any
}

export type TExecuteBuiltRunners = Record<string, IExRunner>
export type TExecuteBuiltTransforms = Record<string, IExTransform>
export type TExecuteBuiltEnvironments = Record<string, IExEnvironment>

export type TExecuteCfg = {
  // TODO: Ensure these are loaded
  preEnvironment?:string[]
  postEnvironment?:string[]

  exam:Exam
  options:TExecuteOptions
  runners?:TExecuteRunners
  transformers?:TExecuteTransformers
  environments?:TExecuteEnvironments
}

export type TExRun<T extends TExData=TExData> = {
  data?: T
  runner?:TExArrClsOptMap<IExRunner, TExRunnerCfg>
  transform?:TExArrClsOptMap<IExTransform, TExTransformCfg>
  environment?:TExArrClsOptMap<IExEnvironment, TEnvironmentCfg>
}

export type TExImportCtx<T extends TExData=TExData> = TExecuteOptions & {
  data: T
  exam:Exam
}

export type TExResolveOpts<T extends TExData=TExData> = TExecuteOptions
  & TExRun<T>
  & {
    exam:Exam
  }

export type TExCtx<T extends TExData=TExData> = Omit<
  TExResolveOpts<T>, `runner`|`transform`|`environment`
> & {
    exam:Exam
    transform?:IExTransform
    environment:IExEnvironment
  }
