import { TSockrConfig } from './sockr.types'
import { TConductorOpts } from './conductor.types'
import { TScreencastServer } from './screencast.types'
import { TJwtConfig, TProxyOpts } from './helpers.types'

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
  sockr?: TSockrConfig
  vncProxy?: TProxyOpts
  wsProxy?: TProxyOpts
  localDevMode?: boolean
  server: TBEServerConfig
  conductor: TConductorOpts
  screencast?: Partial<TScreencastServer>
}