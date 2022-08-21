import type { ClientRequest, IncomingMessage } from 'http' 
import type { Request, Response, Router } from 'express' 
import type { TProxyConfig } from '@gobletqa/conductor/types'

import { FORWARD_HOST_HEADER } from '@GCD/constants'
import { getOrigin } from '@gobletqa/shared/utils/getOrigin'
import { createProxyMiddleware } from 'http-proxy-middleware'

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
 * Sets the Allow Origin header to enable cors
 *
 * @returns {void}
 */
const addAllowOriginHeader = (proxyRes:IncomingMessage, origin:string) => {
  proxyRes.headers['Access-Control-Allow-Origin'] = origin
}

/**
 * Maps the request headers into the proxy request
 * Also replaces the Host header, with the host needed for accessing caddy
 */
const mapRequestHeaders = (
  proxyReq:ClientRequest,
  req:Request,
  addHeaders:Record<string, string>
) => {
  const headers = Object.assign({}, req.headers, addHeaders)

  Object.keys(headers)
    .forEach(key => {
      const lower = key.toLowerCase()
      lower === 'host'
        ? proxyReq.setHeader(key, req.headers[FORWARD_HOST_HEADER])
        : req.headers[key] &&  proxyReq.setHeader(key, req.headers[key])
    })

}

/**
 * Maps the response headers from the response to the proxied response
 * @param {Object} proxyRes - Respose object used by the proxy
 * @param {Object} res - Original response object
 *
 * @returns {void}
 */
const mapResponseHeaders = (proxyRes:IncomingMessage, res:Response) => {
  Object.keys(proxyRes.headers)
    .forEach(key => res.append(key, proxyRes.headers[key]))
}

/**
 * Global proxy handler. Any request that reach here, get passed on to a container via the proxy
 * It's not documented anywhere, but if null is returned, the express app router handles the request
 * This allows the `<domain>/proxy/**` routes to work
 * @function
 * 
 * @returns {Object} - Contains the port and host ip address to proxy the request to
 */
export const createProxy = (config:TProxyConfig, ProxyRouter?:Router) => {
  const { target, proxyRouter, headers, proxy } = config
  const addHeaders = { ...headers, ...proxy?.headers }
  const proxyHandler = createProxyMiddleware({
    ws: true,
    xfwd: true,
    toProxy: true,
    logLevel: 'error',
    onError: onProxyError,
    onProxyReq: (proxyReq, req, res) => {
      mapRequestHeaders(proxyReq, req, addHeaders)
    },
    onProxyRes: (proxyRes:IncomingMessage, req, res) => {
      const origin = getOrigin(req)
      mapResponseHeaders(proxyRes, res)
      addAllowOriginHeader(proxyRes, origin)
    },
    ...proxy,
    target,
    router: proxyRouter,
  })

  ProxyRouter && ProxyRouter.use(proxyHandler)

  return proxyHandler
}