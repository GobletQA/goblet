import type { Express, Request, Response } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { stopScreencast, startScreencast } from '@gobletqa/screencast/screencast'

/**
 * Called when proxy throws an error and can not be connected to
 * This will restart the Screencast and the Browser
 */
const onProxyError = (app:Express) => {
  return async (err:Error, req:Request, res:Response, target:string) => {
    // If the screencast proxy errors
    // Try to restart it
    await stopScreencast()
    await startScreencast()

    // TODO: Add Logger
    res.end(`[SC-Error]: Screencast not running, restarting...`)
  }
}

/**
 * Setup the novnc proxy to forward all requests to that server
 */
export const setupVNCProxy = (app:Express) => {
  const config = app.locals.config || {}

  const {
    port,
    path,
    host,
    protocol,
    ...options
  } = config?.screencast ?? {}

  if(!host) throw new Error(`VNC Proxy host is required!`)

  const url = port ? `${host}:${port}` : host
  const target = `${protocol}://${url}`

  const wsProxy = createProxyMiddleware(path, {
    ...options,
    target,
    ws: true,
    changeOrigin: true,
    // onError: onProxyError(app),
  })

  app.use(wsProxy)

  return wsProxy
}
