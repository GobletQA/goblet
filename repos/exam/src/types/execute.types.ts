import type { Exam } from "@GEX/Exam"
import type { TExArrClsOptMap } from './helpers.types'
import type {
  IExEnvironment,
  TExEnvironmentCfg,
} from './environment.types'
import type {
  IExRunner,
  TExRunnerCfg,
} from './runner.types'
import type {
  IExTransform,
  TExTransformCfg,
} from './transform.types'

import {
  TExecRunners,
  TExecEnvironments,
  TExecTransforms,
}  from './typeMaps.types'
import {TExAst, TExFileModel} from "./file.types"

export type TExData = Record<string, any>

export type TExecuteBuiltRunners = Record<string, IExRunner>
export type TExecuteBuiltTransforms = Record<string, IExTransform>
export type TExecuteBuiltEnvironments = Record<string, IExEnvironment>

// Global options for runner / transform / environment passed from Exam config
export type TExecPassThroughOpts = {
  runner?:TExRunnerCfg
  transform?:TExTransformCfg
  environment?:TExEnvironmentCfg
}

export type TExecuteCfg = {
  exam:Exam
  preEnvironment?:string[]
  postEnvironment?:string[]
  runners?:TExecRunners
  transforms?:TExecTransforms
  environments?:TExecEnvironments
  passthrough:TExecPassThroughOpts
}

type TExRunMaps = {
  runner?:TExArrClsOptMap<IExRunner, TExRunnerCfg>
  transform?:TExArrClsOptMap<IExTransform, TExTransformCfg>
  environment?:TExArrClsOptMap<IExEnvironment, TExEnvironmentCfg>
}

type TExRunMeta<D extends TExData=TExData, Ast extends TExAst=TExAst> = {
  data?: D
  file?:TExFileModel<Ast>
}

export type TExRun<D extends TExData=TExData, Ast extends TExAst=TExAst> = TExRunMaps
  & TExRunMeta<D, Ast>

export type TExImportCtx<T extends TExData=TExData> = {
  data: T
  exam:Exam
}

export type TExExtensionsCtx<
  D extends TExData=TExData,
  Ast extends TExAst=TExAst
> = TExRun<D, Ast> & { exam:Exam }

export type TExCtx<
  D extends TExData=TExData,
  Ast extends TExAst=TExAst
> = TExRunMeta<D, Ast> & {
  exam:Exam
  
  transform?:IExTransform
  environment:IExEnvironment
}
