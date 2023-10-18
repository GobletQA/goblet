import type { IExReporter, TExReporterCfg } from "./reporters.types"
import type {
  TExTypeOpts,
  TExArrOptsMap,
  TExArrClsOptMap,
  TExecutorArrClsOptMap,
} from './helpers.types'
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

export type TExamTransforms<
  Cls extends IExTransform=IExTransform,
  Opts extends TExTransformCfg=TExTransformCfg
> = TExTypeOpts<Cls, Opts>

export type TExamRunners<
  Cls extends IExRunner<any, any>=IExRunner<any, any>,
  Opts extends TExRunnerCfg=TExRunnerCfg
> = TExTypeOpts<Cls, Opts>

export type TExamEnvironment<
  Cls extends IExEnvironment<any, any>=IExEnvironment<any, any>,
  Opts extends TExEnvironmentCfg=TExEnvironmentCfg
> = TExArrOptsMap<Cls, Opts>

export type TExamReporters<
  Cls extends IExReporter=IExReporter,
  Opts extends TExReporterCfg=TExReporterCfg
> = TExArrOptsMap<Cls, Opts>


export type TExecuteOptsMap<Cls=unknown, Opts=unknown> = {
  [key:string]: TExArrClsOptMap<Cls, Opts>
}

export type TExecTransforms<
  Cls extends IExTransform=IExTransform,
  Opts extends TExTransformCfg=TExTransformCfg
> = {
  [key:string]: TExecutorArrClsOptMap<Cls, Opts>
}

export type TExecRunners<
  Cls extends IExRunner<any, any>=IExRunner<any, any>,
  Opts extends TExRunnerCfg=TExRunnerCfg
> = {
  [key:string]: TExecutorArrClsOptMap<Cls, Opts>
}

export type TExecEnvironment<
  Cls extends IExEnvironment<any, any>=IExEnvironment<any, any>,
  Opts extends TExEnvironmentCfg=TExEnvironmentCfg
> = TExecutorArrClsOptMap<Cls, Opts>


export type TExTypeCls = IExRunner<any, any>|IExTransform
export type TExTypeCfg = TExRunnerCfg|TExTransformCfg
export type TExTypeMap = TExamRunners|TExamTransforms