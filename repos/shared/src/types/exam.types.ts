export * from '../../../exam/src/types/index'

import type { TCmdExecOpts } from './socket.types'
import type { TInitExamOpts } from  '../../../exam/src/types/index'
import type { TBuildTestArgs, TBuildBddEnvs } from './testUtils.types'

export type TExamUIRun = TBuildTestArgs
  & TInitExamOpts
  & TBuildBddEnvs

export type TExamUIChildProcOpts = TCmdExecOpts & {
  onError?:(err?:Error) => void
  onStdOut?:(chunk?:string) => void
  onStdErr?:(chunk?:string) => void
  onExit?:(code?:number, signal?:NodeJS.Signals) => void
}

export type TExamCfgArgs = {
  base?:string
}