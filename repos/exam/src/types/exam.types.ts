import type { Exam } from "@GEX/Exam"
import type { TExData, TExecuteCfg, TExRun } from "./execute.types"


export type TExamEvt = {
  type?:string
  fileType?:string
  name:string
  message?:string
  isRunning?:boolean
  // TODO: fix this
  data?:any
}

type TInternalDynEvent =(evt:Partial<TExamEvt>) => TExamEvt

export type TExamEvts = {
  dynamic:TInternalDynEvent
  results:TInternalDynEvent
  specDone:TInternalDynEvent
  specStart:TInternalDynEvent
  suiteDone:TInternalDynEvent
  suiteStart:TInternalDynEvent
  missingType:TInternalDynEvent
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