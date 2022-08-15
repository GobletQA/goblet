
type TPublicUrl = string
type TInternalUrl = string

type TSubdomain = string
type TContainerId = string
type TContainerPort = string
type TContainerName = string

export type TContainerRoute = {
  host: string
  port: string|number
  protocol?: 'http' | 'https' | 'ws' | 'wss'
}

export type TProxyRoute = {
  host: string,
  protocol: string,
  port: string|number,
}

export type TProxyRoutes = {
  [key:string]: TProxyRoute
}

export type TUrlMap = {
  internal: TInternalUrl
  route: TProxyRoute
}

export type TContainerMeta = {
  id: TContainerId
  name: TContainerName
}

export type TPublicUrls = {
  [key:TContainerPort]: TPublicUrl
}

export type TRouteMeta = {
  urls?: TPublicUrls
  meta?: TContainerMeta
  map: Record<TContainerPort, TUrlMap>
}


export type TControllerRoutes = {
  [key:TSubdomain]: TRouteMeta
}
