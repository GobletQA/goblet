
export type TExamEvt = {
  name:string
  message?:string
  isRunning?:boolean
  // TODO: fix this
  data?:any
}

type TOnEvent =(evt:Partial<TExamEvt>) => TExamEvt

export type TExamEvts = {
  dynamic:TOnEvent
  specDone:TOnEvent
  specStart:TOnEvent
  suiteDone:TOnEvent
  suiteStart:TOnEvent
  [key:string]:TExamEvt
}