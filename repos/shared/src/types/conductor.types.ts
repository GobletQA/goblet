
import type { TRouteMeta } from './routes.types'
import type { TProxyConfig } from './proxy.types'
import type { TPort, TPorts } from './ports.types'
import type { Options } from 'http-proxy-middleware'
import type { TLogLevel, TRestartPolicy } from './helpers.types'
import type { ContainerCreateOptions, Container } from 'dockerode'
import type { TControllerType, TControllerConfig } from './controller.types'

export type TContainerOpts = TContainerConfig & {
}

export type TImgOpts = TImgConfig & {
  tag: string
  name: string
  user: string
  provider: string
  container?: TContainerOpts
}

export type TImagesOpts = Record<string, TImgOpts>


export type TControllerConnectOpts = {
  port?:string
  host?:string
  protocol?:string
}

export type TControllerOpts = {
  pidsLimit?: number
  type: TControllerType
  connect?: Record<any, any>
  devRouter?: TRouteMeta
  options: TControllerConnectOpts
}

type TConductorProxyOpts = {
  port?: TPort
  proxy?: Options
  target?: string
  headers?: Record<string, string>
}

export type TConductorOpts = {
  domain?: string
  hashKey?: string
  subdomain?: string
  images: TImagesOpts
  proxy?: TConductorProxyOpts
  controller?:TControllerOpts
}

export type TContainerConfig = {
  mem: number
  idle: number
  ports?: TPorts
  timeout: number
  rateLimit: number
  retryCount: number
  restartPolicy: TRestartPolicy
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
  deployment?: string
  container: TContainerConfig
}

export type TImgsConfig = {
  [key:string]: TImgConfig
}

export type TImgRef = string | TImgConfig

export type TDockerConfig = TControllerConfig & {
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

export type TConductorHeaders = {
  hostHeader:string
  portHeader:string
  protoHeader:string
  routeHeader:string
  subdomainHeader:string
} 

export type TConductorConfig = {
  hashKey?: string
  domain?: string
  subdomain?: string
  images?: TImgsConfig
  proxy?: TProxyConfig
  controller: TDockerConfig
  headers?: TConductorHeaders
}

export type TSpawnOpts = {
  tag?: string
  name?: string
  user?: string
  imageRef: string
  provider?: string
  [key: string]: any
}
