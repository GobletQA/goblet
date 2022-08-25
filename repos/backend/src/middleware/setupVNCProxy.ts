import type { Express, Request } from 'express'
import type { TProxyOpts } from '@GBE/types'

import { getApp } from '@gobletqa/shared/express/app'
import { createProxyMiddleware } from 'http-proxy-middleware'


// This should probably be moved to the conductor/proxy
// And created as a separate proxy from the API
// It does not seem to work using the same port,
// So it gets created as it's own proxy for VNC

/**
 * Setup the novnc proxy to forward all requests to that server
 */
export const setupVNCProxy = (config:TProxyOpts, app:Express) => {
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

  app.use(wsProxy)

  return wsProxy
}
