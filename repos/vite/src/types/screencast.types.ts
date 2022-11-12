import type RFB from '@novnc/novnc/core/rfb'
import type { RefObject, Dispatch, MutableRefObject } from 'react'
import type { NoVncOptions, NoVncCredentials } from '@novnc/novnc/core/rfb'

export type TCanvasExt = {
  logger:TCanvasLogger,
  screen:RefObject<HTMLDivElement>
  rfb:MutableRefObject<RFB | null>
  connected:MutableRefObject<boolean>
  connectRef:MutableRefObject<()=> void>
  disconnectRef:MutableRefObject<()=> void>
  timeouts:MutableRefObject<NodeJS.Timeout[]>
  setLoading: Dispatch<React.SetStateAction<boolean>>
  eventListeners:MutableRefObject<TCanvasEventListeners>
}

export type TConnectExt = TCanvasExt & {
  _onConnect:() => void
  _onDisconnect:() => void
  _onCredentialsRequired:() => void
  _onDesktopName:(...args:any[]) => void
}

export type TCanvasLogger = {
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

export type TCanvasProps = {
  url: string
  style?: object
  debug?: boolean
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
  compressionLevel?: number
  forceShowLoading?: boolean
  loadingProps?: Record<any, any>
  onConnect?: (rfb?: RFB) => void
  rfbOptions?: Partial<TRFBOptions>
  onDisconnect?: (rfb?: RFB) => void
  elementAttrs?: Record<string, string|number>
  onCredentialsRequired?: (rfb?: RFB) => void
  onClipboard?: (e?: { detail: { text: string } }) => void
  onDesktopName?: (e?: { detail: { name: string } }) => void
  onCapabilities?: (e?: { detail: { capabilities: RFB["capabilities"] } }) => void
  onSecurityFailure?: (e?: { detail: { status: number, reason: string } }) => void
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

export type TCanvasEventListeners = { -readonly [key in keyof typeof EEvents]?: (e?: any) => void }

export type TCanvasHandle = {
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
  eventListeners: TCanvasEventListeners
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
