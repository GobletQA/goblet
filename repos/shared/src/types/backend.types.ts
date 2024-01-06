import type { TProxyOpts } from './proxy.types'
import type { TJwtConfig, } from './helpers.types'
import type { TSocketConfig } from './socket.types'
import type { TConductorOpts } from './conductor.types'
import type { TScreencastServer } from './screencast.types'

export type TReqHeaders = Record<string, string>

export type TCookieConfig = {
  key: string
  name: string
  secret: string
  maxAge: string
  expires: string
  sameSite: string
  secure: boolean
  httpOnly: boolean
  overwrite: boolean
}

export type TBEServerConfig = {
  port: string
  host: string
  path: string
  auth: boolean
  origins: string[]
  logLevel: string
  securePort: string
  environment: string
  jwt?: TJwtConfig
  cookie?: TCookieConfig
}

export type TBackendConfig = {
  socket?:TSocketConfig
  vncProxy?:TProxyOpts
  wsProxy?:TProxyOpts
  debugProxy?:TProxyOpts
  localDevMode?:boolean
  server: TBEServerConfig
  conductor: TConductorOpts
  screencast?: Partial<TScreencastServer>
}