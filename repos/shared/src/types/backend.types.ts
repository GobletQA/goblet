import { TJwtConfig, TProxyOpts } from './helpers.types'
import { TConductorOpts } from './conductor.types'
import { TScreencastServer } from './screencast.types'

export type TReqHeaders = Record<string, string>

export type TSockrProcessConfig = {
  root: string
  debug: boolean
  script: string
}

export type TSockrEvent = {
  [key:string]: any
}

export type TSockrEvents = {
  [key:string]: TSockrEvent
}

export type TSockrConfig = {
  path: string
  port: string
  host: string
  events?: TSockrEvents
  process: TSockrProcessConfig
}

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
  jwt: TJwtConfig
  cookie: TCookieConfig
}

export type TBackendConfig = {
  sockr: TSockrConfig
  vncProxy?: TProxyOpts
  localDevMode?: boolean
  server: TBEServerConfig
  conductor: TConductorOpts
  screencast?: Partial<TScreencastServer>
}