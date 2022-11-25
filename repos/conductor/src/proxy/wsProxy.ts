
import type { ServerOptions } from 'http-proxy'
import type { Express, Request } from 'express'
import type { TProxyOpts } from '@gobletqa/shared/types'

import { queryToObj } from '@keg-hub/jsutils'
import { getApp } from '@gobletqa/shared/express/app'
import { createProxyMiddleware } from 'http-proxy-middleware'

/**
 * Setup the novnc proxy to forward all requests to that server
 */
export const createWSProxy = (config:TProxyOpts, app:Express) => {
  app = app || getApp()

  const {
    ws,
    port,
    path,
    host,
    target,
    protocol,
    proxyRouter,
    changeOrigin,
    ...options
  } = (config ?? {}) as TProxyOpts

  if(!host && !target) throw new Error(`VNC Proxy host or target is required!`)

  const url = port ? `${host}:${port}` : host
  const pxTarget = target || `${protocol}://${url}`

  const wsProxy = createProxyMiddleware(path, {
    ws: true,
    xfwd:true,
    toProxy: true,
    logLevel: 'info',
    target: pxTarget,
    changeOrigin: true,
    router: (req:Request) => proxyRouter({ ...req, headers: queryToObj(req.url) } as Request),
    ...options,
  })

  app.use(wsProxy)
  // @ts-ignore
  wsProxy.path = path

  return wsProxy
}
