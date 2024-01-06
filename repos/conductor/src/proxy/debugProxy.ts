import type { Express, Request } from 'express'
import type { TProxyOpts } from '@gobletqa/shared/types'


import { createProxy } from './createProxy'
import { ENVS } from '@gobletqa/environment'
import { getApp } from '@gobletqa/shared/api'
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
    headers,
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
    logLevel: `info`,
    ignorePath: true,
    target: pxTarget,
    changeOrigin: true,
    headers: {
      ...headers,
      // Required to chrome does not refuse the connection request
      Host: `localhost`
    },
    router: (req:Request) => {

      const urlObj = new URL(`http://ignored.placeholder.io:${ENVS.GB_DT_PROXY_PORT}${req.url}`)
      const headers = queryToObj<Record<string, string>>(req.url)
      const routed = proxyRouter({ ...req, headers } as Request)
      const built = `${routed.protocol}//${routed.host}:${urlObj.port}${urlObj.pathname}`

      return built

    },
    ...options,
  })

  app.use(debugProxy.middleware)
  // @ts-ignore
  debugProxy.middleware.path = path

  return debugProxy
}
