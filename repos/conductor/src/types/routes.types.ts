
type TPublicUrl = string
type TContainerId = string
type TContainerPort = string
type TContainerName = string

export type TUserHash = string
export type TPort = string | number

export type TContainerRoute = {
  host: string
  port: string|number
  protocol?: 'http' | 'https' | 'ws' | 'wss'
}

export type TProxyForwardHeaders = {
  [`X-Forwarded-Proto`]: string
  [`X-Forwarded-Port`]: string
  [`X-Forwarded-Host`]: string
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
