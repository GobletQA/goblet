import { Request } from 'express'
import { Options } from 'http-proxy-middleware'
import { ContainerCreateOptions, Container } from 'dockerode'
import { TControllerConfig } from './controller.types'

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
  secret?: string
  rateLimit: number
  logLevel: TLogLevel
  proxyRouter:(req:Request) => Record<any, any>|string
}

export type TServerConfig = {
  port: number,
  host?: string,
  rateLimit: number
  logLevel: TLogLevel
}

export type TConductorConfig = {
  server: TServerConfig
  proxy: TProxyConfig
  images?: TImgsConfig
  controller: TDockerConfig
}

export type TSpawnOpts = {
  imageRef: string
  tag?: string
  name?: string
  user?: string
  provider?: string
  [key: string]: any
}
