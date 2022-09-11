import type { ClientRequest, IncomingMessage } from 'http'
import type { Request, Response } from 'express'
import { FORWARD_HOST_HEADER } from '@GCD/constants'


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
export const addAllowOriginHeader = (proxyRes:IncomingMessage, origin:string) => {
  proxyRes.headers['Access-Control-Allow-Origin'] = origin
}

/**
 * Maps the request headers into the proxy request
 * Also replaces the Host header, with the host needed for accessing caddy
 */
export const mapRequestHeaders = (
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
export const mapResponseHeaders = (proxyRes:IncomingMessage, res:Response) => {
  Object.keys(proxyRes.headers)
    .forEach(key => res.append(key, proxyRes.headers[key]))
}
