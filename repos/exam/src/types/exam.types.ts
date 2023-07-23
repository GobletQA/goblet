import type { Exam } from "@GEX/Exam"
import type { TExData, TExecuteCfg, TExRun } from "./execute.types"
import type { TExEventData } from './results.types'


export type TExamEvt<T=TExEventData> = {
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

export type TExamEvents = {
  events?:TExamEvts
  onEvent?:TExamEventCB
  onCancel?:TExamCancelCB
  onCleanup?:TExamCleanupCB
}

export type TExamConfig = Omit<TExecuteCfg, `exam`> & TExamEvents

export type TExamStartOpts<T extends TExData=TExData> = TExRun<T>
  & Omit<TExamConfig, `runner`|`transform`|`environment`>