import type { TTestRun, TTestRunEvent } from '.'
import type { Repo } from "@gobletqa/repo"
import type { TExTestEventMeta } from "@gobletqa/exam"

export type TExamEvtExtra = Partial<TTestRunEvent> & {
  runId:string
  runTimestamp:string|number
  group?:string
  procId?:number
  fullTestRun?:boolean
}


export type TExamUIRunEvtCB = (meta:TExTestEventMeta) => void
export type TExamUIRunEvts = Record<string, TExTestEventMeta[]>
export type TExamUIRunFinishCB = (meta:TExTestEventMeta, testRun?:TTestRun) => void


export type TParsedEvtOpts = {
  cb?:TExamUIRunEvtCB
  events:TExTestEventMeta[]
  extra?:Partial<TExamEvtExtra>
}

export type TExamUIRunOpts = {
  repo:Repo
  eventSplit?:string
  runTimestamp:number
  saveHtmlReport?:boolean
  saveJsonReport?:boolean
  onEvent?:TExamUIRunEvtCB
  onRunFinish:TExamUIRunFinishCB
  extraEvt:Partial<TExamEvtExtra>
}

export type TExamUIRunFinish = {
  code:number
  cb?:TExamUIRunFinishCB
  extra?:Partial<TExamEvtExtra>
}


export type TKillTestRunUIRunEvtOpts = {
  procId:string|number
}


export enum EUIReportType {
  json=`json`,
  html=`html`
}


export type TUITestEvt = TExTestEventMeta & {
  id:string
  runId:string
  timestamp:number
}

