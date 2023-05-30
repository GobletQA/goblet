import type RFB from '@novnc/novnc/core/rfb'
import type { RefObject, Dispatch, MutableRefObject } from 'react'
import type { NoVncOptions, NoVncCredentials } from '@novnc/novnc/core/rfb'

export enum EBrowserState {
  idle=`idle`,
  playing=`playing`,
  recording=`recording`,
}

export type TBrowserExt = {
  logger:TBrowserLogger,
  screen:RefObject<HTMLDivElement>
  rfb:MutableRefObject<RFB | null>
  _onDisconnect?:(rfb?:RFB) => void
  connected:MutableRefObject<boolean>
  connectRef:MutableRefObject<()=> void>
  disconnectRef:MutableRefObject<()=> void>
  timeouts:MutableRefObject<NodeJS.Timeout[]>
  setLoading: Dispatch<React.SetStateAction<boolean>>
  eventListeners:MutableRefObject<TBrowserEventListeners>
}

export type TConnectExt = TBrowserExt & {
  _onConnect:() => void
  _onDisconnect:(rfb?:RFB) => void
  _onCredentialsRequired:() => void
  _onDesktopName:(...args:any[]) => void
}

export type TBrowserLogger = {
  log: (...args: any[]) => void
  info: (...args: any[]) => void
  error: (...args: any[]) => void
}

export type TCredentials = NoVncCredentials & {
  username?: string
  password?: string
  target?: string
}


export type TRFBOptions = NoVncOptions & {
  shared: boolean
  repeaterID: string
  credentials: TCredentials
  wsProtocols: string|string[]
}
export type TBrowserDetailEvt = {
  detail: {
    text?: string
    name?: string
    reason?: string
    status?: number
    capabilities?: RFB["capabilities"]
  }
}

export type TBrowserCallback = (e?: TBrowserDetailEvt) => void

export type TBrowserProps = {
  url: string
  style?: object
  debug?: boolean
  displayUrl:string
  className?: string
  viewOnly?: boolean
  onBell?: () => void
  background?: string
  autoConnect?: boolean
  qualityLevel?: number
  focusOnClick?: boolean
  clipViewport?: boolean
  dragViewport?: boolean
  retryDuration?: number
  scaleViewport?: boolean
  resizeSession?: boolean
  showDotCursor?: boolean
  loadingFadeout?: boolean
  compressionLevel?: number
  onError?: (event:any) => void
  onClipboard?: TBrowserCallback
  onConnect?: (rfb?: RFB) => void
  loadingProps?: Record<any, any>
  onKeyDown?:( event:Event) => any
  onDesktopName?: TBrowserCallback
  onCapabilities?: TBrowserCallback
  rfbOptions?: Partial<TRFBOptions>
  onDisconnect?: (rfb?: RFB) => void
  onSecurityFailure?: TBrowserCallback
  onCredentialsRequired?: (rfb?: RFB) => void
  elementAttrs?: Record<string, string|number>
}

export enum EEvents {
  bell,
  connect,
  clipboard,
  disconnect,
  desktopname,
  capabilities,
  securityfailure,
  credentialsrequired,
}

export type TBrowserEventListeners = { -readonly [key in keyof typeof EEvents]?: (e?: any) => void }

export type TBrowserHandle = {
  rfb: RFB | null
  blur: () => void
  focus: () => void
  connected: boolean
  connect: () => void
  disconnect: () => void
  machineReset: () => void
  machineReboot: () => void
  sendCtrlAltDel: () => void
  machineShutdown: () => void
  screen:RefObject<HTMLDivElement>
  eventListeners: TBrowserEventListeners
  clipboardPaste: (text: string) => void
  sendCredentials: (credentials: TCredentials) => void
  sendKey: (keysym: number, code: string, down?: boolean) => void
}

export type TScreencastStatus = {
  lastCheck: boolean,
}

export type TBrowserOpts = {
  restart: boolean
  [key:string]: any
}

export type TRecordingBrowser = {
  isRecording: boolean
}

export type TActionRange = {
  endColumn: number
  startColumn: number
  endLineNumber: number
  startLineNumber: number
}

export type TRecordingActions = {
  lineNumber: number
  range: TActionRange
}
