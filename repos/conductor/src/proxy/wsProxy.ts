import type { Express } from 'express'
import type { TProxyOpts } from '@gobletqa/shared/types'

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
    ...options,
  })

  app.use(wsProxy)

  return wsProxy
}
