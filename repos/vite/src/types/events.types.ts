import type { TSymAST } from './shared.types'
import type RFB from '@novnc/novnc/core/rfb'
import {
  TTestRunId,
  TTestRunUICfg,
  TTestRunEvent,
  TTestRunEndEvent,
} from './test.types'


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

export type TTestRunGetUICfgEvt = (cfg:TTestRunUICfg) => void

export type TTestRunExecEvt = {
  runId:TTestRunId
  event?: TTestRunEvent
  events?: TTestRunEvent[]
}

export type TTestRunExecEndEvent = {
  runId:TTestRunId
  event?:TTestRunEndEvent
}