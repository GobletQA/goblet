import type { Request } from 'express'
import type { ServerOptions } from 'http-proxy'
import type { Options } from 'http-proxy-middleware'
import type { TContainerRoute } from './conductor.types'


export type TJwtConfig = {
  exp: string
  secret: string
  refreshExp: string
  refreshSecret: string
  algorithms: string[],
  credentialsRequired: boolean
}

export type TProxyOpts = Options & {
  host:string
  port?:string
  path?:string
  protocol?:string
  proxyRouter?:(req:Request) => TContainerRoute
}

export type TError = Error & {
  statusCode:number
}

export type TException = TError
