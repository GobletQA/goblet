import { Request } from 'express'
import { TCaddyConfig } from './caddy.types'
import { Options } from 'http-proxy-middleware'
import { TControllerConfig } from './controller.types'
import { ContainerCreateOptions, Container } from 'dockerode'

export type TPort = number | string
export type TPorts = TPort[]

export type TContainerConfig = {
  mem: number
  idle: number
  ports?: TPorts
  timeout: number
  rateLimit: number
  runtimeEnvs?: Record<string, string>
  envs?: Record<string, string|boolean|number>
  afterStart?: (container:Container) => void
  beforeStart?: (container:Container) => void
  beforeCreate?: (config:ContainerCreateOptions) => ContainerCreateOptions
}

export type TImgConfig = {
  tag: string
  name: string
  user?: string
  uri?: string
  provider: string
  pidsLimit?: number
  container: TContainerConfig
}

export type TImgsConfig = {
  [key:string]: TImgConfig
}

export type TImgRef = string | TImgConfig

export type TDockerConfig = TControllerConfig & {
}

export type TLogLevel = 'info' | 'warn' | 'error' | 'debug' | 'verbose'

export type TProxyConfig = {
  host?: string
  proxy: Options
  hashKey: string
  timeout: number
  rateLimit: number
  logLevel: TLogLevel
  proxyRouter:(req:Request) => Record<any, any>|string
}

export type TValidationConfig = {
  key: string
  keyHeader: string
}

export type TJWTConfig = {
  exp: string
  secret: string
  refreshExp: string
  refreshSecret: string
  algorithms: string[],
  credentialsRequired: boolean
}

export type TServerConfig = {
  port: number,
  key?: string,
  host?: string,
  jwt: TJWTConfig
  rateLimit: number
  securePort: number
  logLevel: TLogLevel
  validation?: TValidationConfig
}

export type TScreencastConf = {
  active: boolean
}

export type TConductorConfig = {
  caddy: TCaddyConfig
  server: TServerConfig
  proxy: TProxyConfig
  images?: TImgsConfig
  controller: TDockerConfig
  screencast: TScreencastConf
  localDevMode?: boolean
}

export type TSpawnOpts = {
  imageRef: string
  tag?: string
  name?: string
  user?: string
  provider?: string
  [key: string]: any
}
