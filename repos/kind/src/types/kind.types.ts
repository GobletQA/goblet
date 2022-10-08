import type { Kubectl } from '@GKD/Kubectl'
import type { TJwtConfig, TProxyConfig } from './shared.types'
import type { TKubeConfig } from './kubectl.types'

export type AppLocals = {
  kubectl: Kubectl
  config: TKindConfig
}

export type TKDServerConfig = {
  port: string
  host: string
  path: string
  auth: boolean
  origins: string[]
  logLevel?: string
  securePort?: string
  environment: string
  jwt: TJwtConfig
}

export type TKindConfig = {
  server: TKDServerConfig
  kubectl: TKubeConfig
  kubeProxy: TProxyConfig
}

export type {
  Kubectl
}