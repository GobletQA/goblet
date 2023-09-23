import type { Repo } from "@gobletqa/repo"
import type { TExTestEventMeta } from "@gobletqa/exam"

export type TExamUIRunEvts = Record<string, TExTestEventMeta[]>

export type TExamUIRunEvtCB = (meta:TExTestEventMeta) => void
export type TExamUIRunFinishCB = (meta:TExTestEventMeta, events?:TExamUIRunEvts) => void

export type TParsedEvtOpts = {
  cb?:TExamUIRunEvtCB
  events:TExTestEventMeta[]
  extra?:Partial<TExTestEventMeta>
}

export type TExamUIRunOpts = {
  repo:Repo
  runTimestamp:number
  onEvent?:TExamUIRunEvtCB
  onRunFinish:TExamUIRunFinishCB
}

export type TExamUIRunFinish = {
  code:number
  cb?:TExamUIRunFinishCB
}


export type TKillTestRunUIRunEvtOpts = {
  procId:string|number
}