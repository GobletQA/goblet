import { TScreencastServer } from './screencast.types'

export type TReqHeaders = Record<string, string>

export type TConductorServiceConfig = {
  host: string
  key?: string
  port?: string
  protocol?: string
  headers?: Record<string, string>
  [key:string]: any
}

export type TJwtConfig = {
  exp: string
  secret: string
  refreshExp: string
  refreshSecret: string
  algorithms: string[],
  credentialsRequired: boolean
}

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
  hostPWSocket: boolean
  jwt: TJwtConfig
  cookie: TCookieConfig
}

export type TBackendConfig = {
  sockr: TSockrConfig
  server: TBEServerConfig
  conductor: TConductorServiceConfig
  screencast: TScreencastServer
}