
import type { Express, Request } from 'express'
import type { TProxyOpts } from '@gobletqa/shared/types'

import { createProxy } from './createProxy'
import { getApp } from '@gobletqa/shared/api/express/app'
import { queryToObj } from '@keg-hub/jsutils/queryToObj'

/**
 * Setup the novnc proxy to forward all requests to that server
 */
export const createDebugProxy = (config:TProxyOpts, app:Express) => {
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

  if(!host && !target) throw new Error(`Debug Proxy host or target is required!`)

  const url = port ? `${host}:${port}` : host
  const pxTarget = target || `${protocol}://${url}`

  const debugProxy = createProxy(path, {
    ws: true,
    xfwd:true,
    toProxy: true,
    logLevel: 'info',
    target: pxTarget,
    changeOrigin: true,
    router: (req:Request) => proxyRouter({ ...req, headers: queryToObj(req.url) } as Request),
    ...options,
  })

  app.use(debugProxy.middleware)
  // @ts-ignore
  debugProxy.middleware.path = path

  return debugProxy
}
