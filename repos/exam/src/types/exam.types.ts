import {Exam} from "@GEX/Exam"

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


export type TExamConfig = {
  options?:TExamOptions
  onEvent?:TExamEventCB
  onCancel?:TExamCancelCB
  onCleanup?:TExamCleanupCB
}

// TODO: add exam options
export type TExamOptions = {
  
}