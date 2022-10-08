import type { IncomingMessage } from 'http'
import type { Request, Response, Router } from 'express'
import type { TProxyConfig } from '@GKD/Types'
import { checkCall } from '@keg-hub/jsutils'
import { getOrigin } from '@gobletqa/shared/utils/getOrigin'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'

import {
  mapRequestHeaders,
  mapResponseHeaders,
  addAllowOriginHeader,
} from './proxyHelpers'


/**
 * Called when the proxy request throws an error
 * If the hostname matches the proxyHost, then we re-route to it
 * Otherwise we response with 404
 * @function
 * @private
 * @param {Object} err - Error that was thrown while attempting to proxy
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} target - The hostname of the proxy request that failed
 * 
 * @returns {*} - Response in JSON of all routes in the RoutesTable 
 */
export const onProxyError = (err:Error, req:Request, res:Response, proxyHost:string) => {
  res && res.status && res.status(404).send(err?.message || 'Proxy Route not found')
}

/**
 * Global proxy handler. Any request that reach here, get passed on to a container via the proxy
 * It's not documented anywhere, but if null is returned, the express app router handles the request
 * This allows the `<domain>/proxy/**` routes to work
 */
export const setupKubeProxy = (route:string, config:TProxyConfig, ProxyRouter?:Router) => {
  const { target, proxyRouter, headers, proxy } = config
  const addHeaders = { ...headers, ...proxy?.headers }

  const proxyHandler = createProxyMiddleware(route, {
    ws: false,
    xfwd:false,
    toProxy: false,
    logLevel: 'info',

    // changeOrigin: true,
    localAddress: `127.0.0.2`,
    onError: onProxyError,
    target,
    pathRewrite: {
      '^/kube': `/api`
    },
    ...proxy,
    // headers: addHeaders,
    // router: (req:Request) => {
    //   const route = proxyRouter(req)
    //   return typeof proxy?.router === 'function'
    //     // @ts-ignore
    //     ? proxy?.router(req, route) || route
    //     : route
    // },
    onProxyReq: (proxyReq, req:Request, res:Response) => {
      // mapRequestHeaders(proxyReq, req, addHeaders)
      checkCall(proxy?.onProxyReq, proxyReq, req, res)
    },
    onProxyRes: (proxyRes:IncomingMessage, req:Request, res:Response) => {
      const origin = getOrigin(req)
      mapResponseHeaders(proxyRes, res)
      addAllowOriginHeader(proxyRes, origin)
      checkCall(proxy?.onProxyRes, proxyRes, req, res)
    },
  })

  ProxyRouter = ProxyRouter || AsyncRouter
  ProxyRouter.use(proxyHandler)

  return proxyHandler
}