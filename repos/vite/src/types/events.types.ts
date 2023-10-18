import type RFB from '@novnc/novnc/core/rfb'
import type { ESnapTool } from './snapshot.types'
import type { TTestRunUICfg } from './test.types'
import type { TPlayerResEvent, TSymAST, TTestRunId, TTestRunEvent } from './shared.types'


export type TGlobalCopyEvent = {
  text: string
}

export type TBrowserNavEvt = {
  url:string
  ast?:TSymAST[]
}

export type TBrowserIsLoadedEvent = {
  state:boolean
}

export type TVncConnected = {
  rfb:RFB|null
}

export type TSnapshotEvt = {
  type:ESnapTool
}

export type TTestRunGetUICfgEvt = (cfg:TTestRunUICfg) => void

export type TTestRunExecEvt = {
  runId:TTestRunId
  event?: TTestRunEvent
  events?: TTestRunEvent[]
}

export type TTestRunExecEndEvent = {
  runId:TTestRunId
  event?:TPlayerResEvent
}

export type TTestRunExecErrEvent = {
  runId:TTestRunId
  event?:TTestRunEvent
}
