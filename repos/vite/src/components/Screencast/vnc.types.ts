import type RFB from '@novnc/novnc/core/rfb'
import type { RefObject, Dispatch, MutableRefObject } from 'react'
import type { NoVncOptions, NoVncCredentials } from '@novnc/novnc/core/rfb'

export type TVncExt = {
  logger:TVncLogger,
  screen:RefObject<HTMLDivElement>
  rfb:MutableRefObject<RFB | null>
  connected:MutableRefObject<boolean>
  connectRef:MutableRefObject<()=> void>
  disconnectRef:MutableRefObject<()=> void>
  timeouts:MutableRefObject<NodeJS.Timeout[]>
  setLoading: Dispatch<React.SetStateAction<boolean>>
  eventListeners:MutableRefObject<TVncEventListeners>
}

export type TConnectExt = TVncExt & {
  _onConnect:() => void
  _onDisconnect:() => void
  _onCredentialsRequired:() => void
  _onDesktopName:(...args:any[]) => void
}

export type TVncLogger = {
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

export type TVncProps = {
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
  loadingUI?: React.ReactNode
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

export type TVncEventListeners = { -readonly [key in keyof typeof EEvents]?: (e?: any) => void }

export type TVncScreenHandle = {
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
  eventListeners: TVncEventListeners
  clipboardPaste: (text: string) => void
  sendCredentials: (credentials: TCredentials) => void
  sendKey: (keysym: number, code: string, down?: boolean) => void
}