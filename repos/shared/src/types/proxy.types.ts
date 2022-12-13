import type { Request } from 'express'
import type { TPort } from './ports.types'
import type { Options } from 'http-proxy-middleware'
import type { TContainerRoute } from './routes.types'

export type TProxyConfig = {
  port?: TPort
  target: string
  proxy?: Options
  headers?: Record<string, string>
  proxyRouter?:(req:Request) => Record<any, any>|string
}

export type TProxyOpts = Options & {
  host:string
  port?:string
  path?:string
  protocol?:string
  proxyRouter?:(req:Request) => TContainerRoute
}