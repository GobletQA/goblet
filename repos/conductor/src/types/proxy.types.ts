import type { Request } from 'express'
import type { Options } from 'http-proxy-middleware'
import type { TPort } from './helpers.types'

export type TProxyConfig = {
  port?: TPort
  target: string
  proxy?: Options
  headers?: Record<string, string>
  proxyRouter?:(req:Request) => Record<any, any>|string
}
