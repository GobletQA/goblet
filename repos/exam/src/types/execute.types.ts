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
import {TESBuildCfg} from "./loader.types"

export type TExData = Record<string, any>

export type TLoadTransform<T extends IExTransform=IExTransform> = {
  type:string
  options?:TExTransformCfg
  fallback?:IConstructable<T>
  override?:TExArrClsOptMap<T>
}

export type TLoadRunner<T extends IExRunner<any, any>=IExRunner<any, any>> = {
  type:string
  ctx:TExExtensionsCtx
  options?:TExRunnerCfg
  fallback?:IConstructable<T>
  override?:TExArrClsOptMap<T>
}

export type TExecuteBuiltEnvironment = IExEnvironment<any, any>
export type TExecuteBuiltTransforms = Record<string, IExTransform>
export type TExecuteBuiltRunners = Record<string, IExRunner<any, any>>

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
  runner?:TExArrClsOptMap<IExRunner<any, any>, TExRunnerCfg>
  transform?:TExArrClsOptMap<IExTransform, TExTransformCfg>
  environment?:TExArrClsOptMap<IExEnvironment<any, any>, TExEnvironmentCfg>
}

type TExRunMeta<D extends TExData=TExData, Ast extends TExAst=TExAst> = {
  data?: D
  file?:TExFileModel<Ast>
  esbuild?:TESBuildCfg|false
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
  runner:IExRunner<any, any>
  environment:IExEnvironment<any, any>
}
