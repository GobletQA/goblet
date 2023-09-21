import type { TSymAST, TExamUIRun } from './shared.types'
import type RFB from '@novnc/novnc/core/rfb'


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

export type TExamGetExamUICfgEvt = (cfg:TExamUIRun) => void