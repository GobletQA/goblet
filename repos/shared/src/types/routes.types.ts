import type url from 'url'
import type { TPort } from './ports.types'
import type { EContainerState, TUserHash } from './helpers.types'

type ProxyTarget = string | Partial<url.Url> | {
  ca?:string
  host:string
  port:number
  key?:string
  cert?:string
  ciphers?:string
  protocol?:string
  hostname?:string
  socketPath?:string
  passphrase?:string
  pfx?:Buffer|string
  secureProtocol?:string
}

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
  [`x-goblet-route`]: string
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

export type TRouteMetaRoutes = Record<TContainerPort, TProxyRoute>

export type TRouteMeta = {
  error?: string
  meta: TContainerMeta
  routes: TRouteMetaRoutes
}

export type TPublicUrls = {
  [key:TContainerPort]: TPublicUrl
}


export type TControllerRoutes = {
  [key:TUserHash]: TRouteMeta
}
