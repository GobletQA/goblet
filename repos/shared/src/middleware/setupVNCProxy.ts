import type { Express } from 'express'
import type { TProxyOpts } from '@GSH/types'

import { getApp } from '../express/app'
import { exists } from '@keg-hub/jsutils'
import { createProxyMiddleware } from 'http-proxy-middleware'


// TODO: Update this to be dynamic based on containers started from the conductor
// This might need to be moved
// It's not currently being used by the backend api

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

  if(!host) throw new Error(`VNC Proxy host is required!`)

  const url = port ? `${host}:${port}` : host

  const wsProxy = createProxyMiddleware(path, {
    ws: exists(ws) ? ws : true,
    target: target || `${protocol}://${url}`,
    changeOrigin: exists(changeOrigin) ? changeOrigin :  true,
    ...options,
  })

  app.use(wsProxy)

  return wsProxy
}
