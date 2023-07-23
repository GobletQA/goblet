import type { Exam } from "@GEX/Exam"
import type { TLoaderCfg } from "./loader.types"
import type { TExTypeOpts } from './helpers.types'
import type { TExEventData } from './results.types'
import type { TReporterCls } from "./reporters.types"

import type { TSerializeObj } from './environment.types'
import type { TExData, TExecuteCfg, TExecuteOptions, TExRun } from "./execute.types"
import {
  TExamRunners,
  TExamReporters,
  TExamEnvironments,
  TExamTransformers,
}  from './typeMaps.types'
import {TExFileModel} from "./file.types"


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


export type TExamOptions = TLoaderCfg & {
  // TODO: ensure globals get set in the environment
  globals?:TSerializeObj

  // TODO: add logic for inline check
  testInline:string|TExFileModel

  // TODO: ensure transform ignores these files
  transformIgnore?:string[]

  // TODO: Use module-alias to setup aliases
  aliases?:Record<string, string>

  // TODO: implement reporters
  reporters?:TExamReporters

  // These get convert form strings to classes in the Exam Loader
  execute?:Omit<TExecuteOptions, `runners`|`transforms`|`environments`> & {
    runners: TExamRunners
    transforms: TExamTransformers
    environments: TExamEnvironments
  }
}

export type TExamEvents = {
  events?:TExamEvts
  onEvent?:TExamEventCB
  onCancel?:TExamCancelCB
  onCleanup?:TExamCleanupCB
}

export type TExamConfig = Omit<TExecuteCfg, `exam`|`options`>
  & TExamEvents
  & TExamOptions

export type TExamStartOpts<T extends TExData=TExData> = TExRun<T>
  & Omit<TExamConfig, `runner`|`transform`|`environment`>