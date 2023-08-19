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
  file:TExFileModel
  options?:TExTransformCfg
  fallback?:IConstructable<T>
  override?:TExArrClsOptMap<T>
}

export type TLoadRunner<T extends IExRunner<any, any>=IExRunner<any, any>> = {
  file:TExFileModel
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
  preRunner?:TLoadFilesArr
  postRunner?:TLoadFilesArr
  environment?:TExecEnvironment
  preEnvironment?:TLoadFilesArr
  postEnvironment?:TLoadFilesArr

  runners?:TExecRunners
  transforms?:TExecTransforms
  passthrough:TExecPassThroughOpts
  onStartup?:TLoadFilesArr
  onShutdown?:TLoadFilesArr
}

type TExRunMaps = {
  runner?:TExArrClsOptMap<IExRunner<any, any>, TExRunnerCfg>
  transform?:TExArrClsOptMap<IExTransform, TExTransformCfg>
  environment?:TExArrClsOptMap<IExEnvironment<any, any>, TExEnvironmentCfg>
}

type TExRunMeta<D extends TExData=TExData, Ast extends TExAst=TExAst> = {
  data?: D
  transformed?:unknown
  file?:TExFileModel<Ast>
  esbuild?:TESBuildCfg|false
}

export type TExRun<D extends TExData=TExData, Ast extends TExAst=TExAst> = TExRunMaps
  & TExRunMeta<D, Ast>

export type TExImportCtx<T extends TExData=TExData> = {
  data: T
}

export type TExExtensionsCtx<
  D extends TExData=TExData,
  Ast extends TExAst=TExAst
> = Omit<TExRun<D, Ast>, `file`> & { file?:any }

export type TExCtx<
  D extends TExData=TExData,
  Ast extends TExAst=TExAst
> = TExRunMeta<D, Ast> & {
  transform?:IExTransform
  runner?:IExRunner<any, any>
  environment:IExEnvironment<any, any>
}

export type TLoadFileWOpts = string | [string, Record<any, any>]

export type TLoadFilesArr = Array<TLoadFileWOpts>