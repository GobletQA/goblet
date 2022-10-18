import type { TPort, TPortsMap } from './ports.types'
import type { Conductor } from '../conductor'
import type { TUserHash, EContainerState } from './helpers.types'

type TPublicUrl = string
type TContainerId = string
type TContainerPort = string
type TContainerName = string

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

export type TGenRoute = {
  hostPort:TPort,
  userHash:TUserHash,
  containerPort:TPort,
  conductor:Conductor,
  meta: TContainerMeta
}

export type TGenRoutes = {
  ports:TPortsMap,
  userHash:TUserHash,
  conductor:Conductor,
  meta: TContainerMeta
}