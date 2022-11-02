import type { IncomingMessage } from 'http'
import type { Request, Response, Router } from 'express'
import type { TProxyConfig } from '@gobletqa/conductor/types'

import { checkCall, exists } from '@keg-hub/jsutils'
import { getOrigin } from '@gobletqa/shared/utils/getOrigin'
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware'

import {
  iframeHeaders,
  mapRequestHeaders,
  mapResponseHeaders,
  replaceResponseText,
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

const ensureHeaders = (headers:Record<string, string>) => {
  return Object.entries(headers)
    .reduce((acc, [key, val]) => {
      exists(key)
        && exists(val)
        && (acc[key] = val)

      return acc
    }, {})
}

/**
 * Global proxy handler. Any request that reach here, get passed on to a container via the proxy
 * It's not documented anywhere, but if null is returned, the express app router handles the request
 * This allows the `<domain>/proxy/**` routes to work
 * @function
 * 
 * @returns {Object} - Contains the port and host ip address to proxy the request to
 */
export const createIframeProxy = (config:TProxyConfig, ProxyRouter?:Router) => {
  const { target, proxyRouter, headers, proxy } = config
  const addHeaders = ensureHeaders({ ...headers, ...proxy?.headers })
  

  const proxyHandler = createProxyMiddleware({
    ws: true,
    secure: false,
    logLevel: 'error',
    autoRewrite: true,
    changeOrigin: true,
    onError: onProxyError,
    selfHandleResponse: true,
    target,
    ...proxy,
    headers: addHeaders,
    router: (req:Request) => {
      
      return ''
    },
    onProxyReq: (proxyReq, req:Request, res:Response) => {
      // mapRequestHeaders(proxyReq, req, addHeaders)
      // let url = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
      
    },
    onProxyRes: responseInterceptor(async (
      buffer,
      proxyRes:IncomingMessage,
      req:Request,
      res:Response
    ) => {
      // const origin = getOrigin(req)
      // const responseText = buffer.toString('utf8')
      // const hostDomain = req.get('host')

      
      // replaceResponseText(
      //   responseText,
      //   origin,
      //   hostDomain,
      //   {
      //     '{upstream_hostname}': '{proxy_hostname}',
      //   }
      // )
      
      // iframeHeaders(proxyRes, origin)
      // mapResponseHeaders(proxyRes, res)

      return buffer
    }),
  })

  ProxyRouter && ProxyRouter.use(proxyHandler)

  return proxyHandler
}