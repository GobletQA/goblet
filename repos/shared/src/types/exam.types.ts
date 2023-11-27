export * from '../../../exam/src/types/index'

import type { TCmdExecOpts } from './socket.types'
import type { TExTestEventMeta } from '../../../exam/src/types/index'
import type { TInitExamOpts } from  '../../../exam/src/types/index'
import type { TBuildTestArgs, TBuildBddEnvs } from './testUtils.types'

export type TExamUIRunCallbacks = {
  onDone?: (code?:number) => void
  onFailed?: (error?:Error) => void
  onEvent?: (events?:TExTestEventMeta[]) => void
  onError?: (events?:TExTestEventMeta[]) => void
  extraEvtData?: (events?:TExTestEventMeta[]) => Record<string, any>
}

export type TExamUIRun = TBuildTestArgs
  & TInitExamOpts
  & TBuildBddEnvs
  & TExamUIRunCallbacks

export type TExamUIChildProcOpts = TCmdExecOpts & {
  onError?:(err?:Error) => void
  onStdOut?:(chunk?:string) => void
  onStdErr?:(chunk?:string) => void
  onExit?:(code?:number, signal?:NodeJS.Signals) => void
}

export type TExamCfgArgs = {
  base?:string
}