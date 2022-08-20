


export type TCaddyConfig = {
  url: string
  host: string
  data?: Record<string,any>
  headers?: Record<string,string>
  [key: string]: any
}

export type TCaddyApiOpts = {
  id?: string
  [key: string]: any
}

export type TCaddyServerRoutes = {
  group: string
  terminal: boolean
  match: Record<any, any>
  handle: Record<any, any>
}

export type TCaddyServerAutomaticHttps = {
  disable?: boolean,
  disable_redirects?: boolean,
  disable_certificates?: boolean,
  skip?: string[],
  skip_certificates?: string[],
  ignore_loaded_certificates?: boolean
}

export type TCaddyApiServer = {
  listen?: string[]
  allow_h2c?: boolean
  read_timeout?: number
  idle_timeout?: number
  write_timeout?: number
  logs: Record<any, any>
  max_header_bytes?: number
  strict_sni_host?: boolean
  routes?: TCaddyServerRoutes
  experimental_http3?: boolean
  listener_wrappers?: Record<any, any>
  tls_connection_policies?: Record<any, any>[]
  errors?: Record<'routes', TCaddyServerRoutes>
  automatic_https?: TCaddyServerAutomaticHttps
}

export type TCaddyApiServers = Record<string, TCaddyApiServer>

export type TCaddyHttpApiApps = {
  http_port: number
  https_port: number
  grace_period: number
  servers: TCaddyApiServers
}

export type TCaddyApiApps = {
  http: TCaddyHttpApiApps
  pki: Record<any, any>
  ssh: Record<any, any>
  tls: Record<any, any>
  exec: Record<any, any>
  layer4: Record<any, any>
  crowdsec: Record<any, any>
}

export type TCaddyApiAdmin = {
  listen: string
  disabled: boolean
  origin: string[]
  enforce_origin: boolean
  config: Record<any, any>
  identity: Record<any, any>
  remote: Record<any, any>
}

export type TCaddyApiConfig = {
  apps: TCaddyApiApps
  admin: TCaddyApiAdmin
  logging: Record<any, any>
  storage: Record<any, any>
}

export type TCaddyHydrateOpts = {
  [key: string]: any
}