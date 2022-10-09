import type { TProxyConfig } from './proxy.types'
import type { TLogLevel, TPorts, TRestartPolicy } from './helpers.types'
import type { TControllerConfig } from './controller.types'
import type { ContainerCreateOptions, Container } from 'dockerode'


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

export type TConductorConfig = {
  hashKey?: string
  domain?: string
  subdomain?: string
  images?: TImgsConfig
  proxy?: TProxyConfig
  controller: TDockerConfig
}

export type TSpawnOpts = {
  tag?: string
  name?: string
  user?: string
  imageRef: string
  provider?: string
  [key: string]: any
}
