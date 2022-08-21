import type { TUserHash, TPort } from './helpers.types'

type TPublicUrl = string
type TContainerId = string
type TContainerPort = string
type TContainerName = string

export type TContainerRoute = {
  host: string
  port: string|number
  protocol?: 'http' | 'https' | 'ws' | 'wss'
}

export type TProxyForwardHeaders = {
  [`x-forwarded-host`]: string
  [`x-forwarded-proto`]: string
  [`x-forwarded-port`]: string | number
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
  state: `Creating` | `Running` | `Stopped` | `Missing`
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
