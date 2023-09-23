import type { Repo } from "@gobletqa/repo"
import type { TExTestEventMeta } from "@gobletqa/exam"

export type TExamEvtExtra = Partial<TExTestEventMeta> & {
  runId:string
  runTimestamp:string|number
  group?:string
  procId?:number
  fullTestRun?:boolean
}


export type TExamUIRunEvts = Record<string, TExTestEventMeta[]>

export type TExamUIRunEvtCB = (meta:TExTestEventMeta) => void
export type TExamUIRunFinishCB = (meta:TExTestEventMeta, events?:TExamUIRunEvts) => void

export type TParsedEvtOpts = {
  cb?:TExamUIRunEvtCB
  events:TExTestEventMeta[]
  extra?:Partial<TExamEvtExtra>
}

export type TExamUIRunOpts = {
  repo:Repo
  runTimestamp:number
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