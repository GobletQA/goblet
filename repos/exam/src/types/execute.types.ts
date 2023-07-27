import type { Exam } from "@GEX/Exam"
import type { IConstructable, TExArrClsOptMap } from './helpers.types'
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
  TExecTransforms,
  TExecEnvironment,
}  from './typeMaps.types'
import {TExAst, TExFileModel} from "./file.types"

export type TExData = Record<string, any>

export type TLoadTransform<T extends IExTransform=IExTransform> = {
  type:string
  options?:TExTransformCfg
  fallback?:IConstructable<T>
  override?:TExArrClsOptMap<T>
}

export type TLoadRunner<T extends IExRunner=IExRunner> = {
  type:string
  options?:TExRunnerCfg
  fallback?:IConstructable<T>
  override?:TExArrClsOptMap<T>
}

export type TExecuteBuiltEnvironment = IExEnvironment
export type TExecuteBuiltRunners = Record<string, IExRunner>
export type TExecuteBuiltTransforms = Record<string, IExTransform>

// Global options for runner / transform / environment passed from Exam config
export type TExecPassThroughOpts = {
  runner?:TExRunnerCfg
  transform?:TExTransformCfg
  environment?:TExEnvironmentCfg
}

export type TExecuteCfg = {
  exam:Exam
  preRunner?:string[]
  postRunner?:string[]
  preEnvironment?:string[]
  postEnvironment?:string[]
  environment?:TExecEnvironment

  runners?:TExecRunners
  transforms?:TExecTransforms
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
