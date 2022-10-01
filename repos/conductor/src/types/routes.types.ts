import type { TUserHash, TPort } from './helpers.types'

type TPublicUrl = string
type TContainerId = string
type TContainerPort = string
type TContainerName = string

export type TContainerState = `Creating` | `Running` | `Stopped` | `Missing`
export type TProtocol = 'http' | 'https' | 'ws' | 'wss' | 'http:' | 'https:' | 'ws:' | 'wss:'

export type TContainerRoute = {
  host?: string
  port?: string|number
  protocol?: TProtocol
}

export type TProxyForwardHeaders = {
  [`x-goblet-host`]: string
  [`x-goblet-proto`]: string
  [`x-goblet-subdomain`]: string
  [`x-goblet-port`]: string | number
}

export type TProxyRoute = {
  host: string
  port: TPort
  protocol: string
  containerPort: TPort
  headers?: TProxyForwardHeaders
}

export type TProxyRoutes = {
  [key:string]: TProxyRoute
}

export type TContainerMeta = {
  id: TContainerId
  name: TContainerName
  state: TContainerState
}

export type TPublicUrls = {
  [key:TContainerPort]: TPublicUrl
}

export type TRouteMeta = {
  meta?: TContainerMeta
  routes: Record<TContainerPort, TProxyRoute>
}


export type TControllerRoutes = {
  [key:TUserHash]: TRouteMeta
}
