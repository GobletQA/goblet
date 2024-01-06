import type RFB from '@novnc/novnc/core/rfb'
import type { TTestRunUICfg } from './test.types'
import type { TTestRunId, TTestRunEvent, TPlayerResEvent } from './shared.types'
import {EBrowserState} from './screencast.types'

export type TGlobalCopyEvent = {
  text: string
}

export type TBrowserNavEvt = {
  url:string
}

export type TBrowserIsLoadedEvent = {
  state:boolean
}

export type TVncConnected = {
  rfb:RFB|null
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

export type TBrowserStateEvt = {
  browserState: EBrowserState
}
