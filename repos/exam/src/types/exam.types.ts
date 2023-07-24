import type { Exam } from "@GEX/Exam"
import type { TLoaderCfg } from "./loader.types"
import type { TExEventData } from './results.types'
import type {
  TExRun,
  TExData,
  TExecuteCfg,
  TExecPassThroughOpts
} from "./execute.types"
import {
  TExamRunners,
  TExamReporters,
  TExamEnvironments,
  TExamTransformers,
}  from './typeMaps.types'
import {TExAst, TExFileModel} from "./file.types"


export type TExamEvt<T=TExEventData|TExEventData[]> = {
  data?:T
  name:string
  message?:string
  isRunning?:boolean
}

type TInternalDynEvent =(evt:Partial<TExamEvt>) => TExamEvt
type TInternalMissingEvent =(evt:Partial<TExamEvt>& { type?:string, fileType?:string }) => TExamEvt

export type TExamEvts = {
  dynamic:TInternalDynEvent
  results:TInternalDynEvent
  specDone:TInternalDynEvent
  specStart:TInternalDynEvent
  suiteDone:TInternalDynEvent
  suiteStart:TInternalDynEvent
  missingType:TInternalMissingEvent
  [key:string]:TExamEvt
}

export type TExamCB = (exam:Exam) => void
export type TExamCleanupCB = TExamCB
export type TExamCancelCB = TExamCB
export type TExamEventCB = (event:TExamEvt) => void

export enum EExTestMode {
  serial=`serial`,
  parallel=`parallel`
}

export type TExamEvents = {
  events?:TExamEvts
  onEvent?:TExamEventCB
  onCancel?:TExamCancelCB
  onCleanup?:TExamCleanupCB
}


export type TExamCfg = TLoaderCfg
  & TExecPassThroughOpts[`runner`]
  & TExecPassThroughOpts[`transform`]
  & TExecPassThroughOpts[`environment`]
  & {
    // These get convert form strings to classes in the Exam Loader
    runners: TExamRunners
    transforms: TExamTransformers
    environments: TExamEnvironments

    // TODO: add logic for inline check
    testInline:string|TExFileModel

    // TODO: ensure transform ignores these files
    transformIgnore?:string[]

    // TODO: Use module-alias to setup aliases
    aliases?:Record<string, string>

    // TODO: implement reporters
    reporters?:TExamReporters

    // TODO: implement different modes
    mode?:EExTestMode
  }

export type TExamConfig = TExamCfg
  & TExamEvents
  & Omit<TExecuteCfg, `exam`|`runners`|`transforms`|`environments`>

export type TExamStartOpts<
  D extends TExData=TExData,
  Ast extends TExAst=TExAst
> = TExamEvents
  & TExRun<D, Ast>
  & Omit<TExamConfig, `runners`|`transforms`|`environments`>