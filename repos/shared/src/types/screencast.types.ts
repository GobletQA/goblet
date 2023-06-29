import { TJwtConfig } from './helpers.types'
import { TTailLogger } from './tailLogger.types'
import { TSocketConfigOpts } from './socket.types'
import { TBrowserContextOpts, TBrowserConf, TBrowserPage } from './pw.types'

export type TChildProcArgs = {
  cwd: string
  args: string[]
  env: Record<string, any>
  options: Record<string, any>
}

export type TSSLCreds = {
  ca: string
  key: string
  cert: string
}

export type TRecorderOpts = {
  locator: string
  [key:string]: any
}

export type TScreencastServer = {
  port: string
  host: string
  path?: string
  auth?: boolean
  active?: boolean
  protocol?: string
  origins: string[]
  logLevel: string
  securePort: string
  environment: string
  jwt: TJwtConfig
}

export type TVncConfig = {
  host: string
  port: string
  display: string
  width: string | number
  height: string | number
}

export type TNoVncProxy = {
  host: string
  port: string
}

export type TScreencastConfig = {
  active?: boolean
  vnc?: TVncConfig
  novnc?: TNoVncProxy
  page?: TBrowserPage
  browser?: TBrowserConf
  context?: TBrowserContextOpts
}

export type TSCContainerConfig = {
  timeoutActive?: boolean
  idleWaitToStart?:number
  inactiveTimeout?: number
  inactiveThreshold?: number
  connectionThreshold?:number
}

export type TGScreencastConfig = {
  tail: TTailLogger
  server: TScreencastServer
  socket: TSocketConfigOpts
  screencast: TScreencastConfig
  container?: TSCContainerConfig
}
