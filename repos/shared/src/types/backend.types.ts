
export type TReqHeaders = Record<string, string>

export type TConductorServiceConfig = {
  host: string
  port?: string
  protocol?: string
  headers: Record<string, string>
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

export type TSockrConfig = {
  path: string
  port: string
  host: string
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

export type TBackendConfig = {
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
  sockr: TSockrConfig
  cookie: TCookieConfig
  conductor: TConductorServiceConfig
  [key:string]: any
}