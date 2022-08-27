import type { Express, Request } from 'express'
import type { TProxyOpts } from '@gobletqa/shared/types'

import { getApp } from '@gobletqa/shared/express/app'
import { createProxyMiddleware } from 'http-proxy-middleware'

/**
 * Setup the novnc proxy to forward all requests to that server
 */
export const createVNCProxy = (config:TProxyOpts, app:Express) => {
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

  const vncProxy = createProxyMiddleware(path, {
    ws: true,
    xfwd:true,
    logLevel: 'warn',
    ignorePath: true,
    target: pxTarget,
    changeOrigin: true,
    router: (req:Request) => {
      const port = req.url.split(`?`).pop()
      const route = `${pxTarget}?${port}`

      return route
    },
    ...options,
  })

  app.use(vncProxy)
  // @ts-ignore
  vncProxy.path = path

  return vncProxy
}
