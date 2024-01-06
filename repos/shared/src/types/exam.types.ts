export * from '../../../exam/src/types'

import type { TBuildTestArgs, TBuildBddEnvs } from './testify.types'
import type { TExamConfig, TInitExamOpts, TExTestEventMeta } from '../../../exam/src/types'

export type TCmdExecOpts = {
  cwd?: string
  gid?: number,
  uid?: number,
  shell?: string,
  detached?: boolean,
  stdio?: string | string[],
  env?:Record<string, string>,
}


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

export {
  TExamConfig
}