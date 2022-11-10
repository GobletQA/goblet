import type {
  NoVncOptions,
  NoVncCredentials,
} from '@novnc/novnc/core/rfb'
import type { NovncService } from '@services/novncService'

export type TNovncCustomEvt = (event: CustomEvent) => void
export type TNovncCallback = (instance:NovncService, ...args:any[]) => void
export type TCBPasteCallback = (instance:NovncService, text: string) => void
export type TSendCredsCallback = (instance:NovncService, credentials: NoVncCredentials) => void
export type TSendKeyCallback = (instance:NovncService, keysym: number, code: string, down?: boolean) => void

export type TNovncCallbacks = {
  blur?:TNovncCallback
  focus?:TNovncCallback
  sendKey?:TSendKeyCallback
  sendCtrlAltDel?:TNovncCallback
  clipboardPaste?:TCBPasteCallback
  sendCredentials?:TSendCredsCallback
  connect?:TNovncCallback
  disconnect?:TNovncCallback
  clipboard?:TNovncCallback
  desktopname?:TNovncCallback
  capabilities?:TNovncCallback
  securityfailure?:TNovncCallback
  credentialsrequired?:TNovncCallback
}

export type TNovncService = TNovncCallbacks & {
  url?:string,
  element?:any,
  viewOnly?:boolean
  background?:string
  autoInit?:boolean
  qualityLevel?:number
  focusOnClick?:boolean
  clipViewport?:boolean
  dragViewport?:boolean
  resizeSession?:boolean
  scaleViewport?:boolean
  showDotCursor?:boolean
  compressionLevel?:number
  rfbOptions?:NoVncOptions
}
