import { Request, Response } from 'express' 
import { TProxyConfig } from '@gobletqa/conductor/types'

import { getOrigin } from '@gobletqa/shared/utils/getOrigin'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { ProxyRouter } from '@gobletqa/conductor/server/routers'

const { HOSTNAME, GB_CD_HOST } = process.env

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
export const onProxyError = (err, req:Request, res:Response, proxyHost:string) => {
  res && res.status && res.status(404).send(err.message || 'Proxy Route not found')
}



const addAllowOriginHeader = (proxyRes, origin) => {
  proxyRes.headers['Access-Control-Allow-Origin'] = origin
}

const mapRequestHeaders = (proxyReq, req) => {
  Object.keys(req.headers)
    .forEach(key => proxyReq.setHeader(key, req.headers[key]))
}

/**
 * Maps the response headers from the response to the proxied response
 * @param {Object} proxyRes - Respose object used by the proxy
 * @param {Object} res - Original response object
 *
 * @returns {void}
 */
const mapResponseHeaders = (proxyRes, res) => {
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
export const createProxy = (config:TProxyConfig) => {
  const { host, proxyRouter, proxy } = config
  const proxyHandler = createProxyMiddleware({
    ws: true,
    xfwd: true,
    toProxy: true,
    logLevel: 'error',
    router: proxyRouter,
    onError: onProxyError,
    target: host || HOSTNAME || GB_CD_HOST,
    onProxyReq: (proxyReq, req, res) => {
      mapRequestHeaders(proxyReq, req)
    },
    onProxyRes: (proxyRes, req, res) => {
      const origin = getOrigin(req)
      mapResponseHeaders(proxyRes, res)
      addAllowOriginHeader(proxyRes, origin)
    },
    ...proxy,
  })

  ProxyRouter.use(proxyHandler)

  return proxyHandler
}
