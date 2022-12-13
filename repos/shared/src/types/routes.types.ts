import type { TPort } from './ports.types'
import type { ProxyTarget } from 'http-proxy'
import type { EContainerState, TUserHash } from './helpers.types'

type TPublicUrl = string
type TContainerId = string
type TContainerPort = string
type TContainerName = string

export type TProtocol = 'http' | 'https' | 'ws' | 'wss' | 'http:' | 'https:' | 'ws:' | 'wss:'

export type TContainerRoute = ProxyTarget & {
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
  host?: string
  id?: TContainerId
  name?: TContainerName
  state: EContainerState
}

export type TRouteMeta = {
  error?: string
  meta: TContainerMeta
  routes: Record<TContainerPort, TProxyRoute>
}

export type TPublicUrls = {
  [key:TContainerPort]: TPublicUrl
}


export type TControllerRoutes = {
  [key:TUserHash]: TRouteMeta
}
