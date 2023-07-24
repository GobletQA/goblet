import type { TReporterCls } from "./reporters.types"
import type {
  TExTypeOpts,
  TExArrClsOptMap,
  TExecutorArrClsOptMap
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
} from './transformer.types'

export type TExamTransformers<
  Cls extends IExTransform=IExTransform,
  Opts extends TExTransformCfg=TExTransformCfg
> = TExTypeOpts<Cls, Opts>

export type TExamRunners<
  Cls extends IExRunner=IExRunner,
  Opts extends TExRunnerCfg=TExRunnerCfg
> = TExTypeOpts<Cls, Opts>

export type TExamEnvironments<
  Cls extends IExEnvironment=IExEnvironment,
  Opts extends TExEnvironmentCfg=TExEnvironmentCfg
> = TExTypeOpts<Cls, Opts>

export type TExamReporters<
  R extends TReporterCls=TReporterCls
> = TExTypeOpts<R>


export type TExecuteOptsMap<Cls=unknown, Opts=unknown> = {
  [key:string]: TExArrClsOptMap<Cls, Opts>
}

export type TExecTransformers<
  Cls extends IExTransform=IExTransform,
  Opts extends TExTransformCfg=TExTransformCfg
> = {
  [key:string]: TExecutorArrClsOptMap<Cls, Opts>
}

export type TExecRunners<
  Cls extends IExRunner=IExRunner,
  Opts extends TExRunnerCfg=TExRunnerCfg
> = {
  [key:string]: TExecutorArrClsOptMap<Cls, Opts>
}

export type TExecEnvironments<
  Cls extends IExEnvironment=IExEnvironment,
  Opts extends TExEnvironmentCfg=TExEnvironmentCfg
> = {
  [key:string]: TExecutorArrClsOptMap<Cls, Opts>
}


export type TExTypeCls = IExRunner|IExTransform|IExEnvironment
export type TExTypeCfg = TExRunnerCfg|TExTransformCfg|TExEnvironmentCfg
export type TExTypeMap = TExamRunners|TExamTransformers|TExamEnvironments