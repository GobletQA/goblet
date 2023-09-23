import type { TSymAST } from './shared.types'
import type RFB from '@novnc/novnc/core/rfb'
import {TTestRunUICfg, TTestRunEvent, TTestRunId} from './test.types'


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

export type TTestsGetUICfgEvt = (cfg:TTestRunUICfg) => void

export type TOnTestRunEvent = {
  runId:TTestRunId
  event?: TTestRunEvent
  events?: TTestRunEvent[]
}
