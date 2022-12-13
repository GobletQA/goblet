import type { ClientRequest, IncomingMessage } from 'http'
import type { Request, Response } from 'express'

import { Logger } from '../utils/logger'
import { ForwardHostHeader } from '@GCD/constants'

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
        ? proxyReq.setHeader(key, req.headers[ForwardHostHeader])
        : req.headers[key] && proxyReq.setHeader(key, req.headers[key])
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
    .forEach(key => 
      !proxyRes.headers[key]
        && res.append(key, proxyRes.headers[key]
    ))
}


export const iframeResHeaders = (proxyRes:IncomingMessage, res:Response, origin:string) => {
  addAllowOriginHeader(proxyRes, origin)
  mapResponseHeaders(proxyRes, res)
  res.removeHeader(`x-frame-options`)
}

export const iframeReqHeaders = (
  proxyReq:ClientRequest,
  req:Request,
  addHeaders:Record<string, string>
) => {
  const headers = Object.assign({}, req.headers, addHeaders)
  Object.keys(headers)
    .forEach(key => req.headers[key] && proxyReq.setHeader(key, req.headers[key]))
}

export const withCORS = (headers:Record<string, string>, request:Request) => {
  headers['access-control-allow-origin'] = '*'

  if (request.headers['access-control-request-method']) {
    headers['access-control-allow-methods'] = request.headers['access-control-request-method']
    delete request.headers['access-control-request-method']
  }

  if (request.headers['access-control-request-headers']) {
    headers['access-control-allow-headers'] = request.headers['access-control-request-headers']
    delete request.headers['access-control-request-headers']
  }

  headers['access-control-expose-headers'] = Object.keys(headers).join(',')

  return headers
}




const shouldRewrite = (req:Request, res:Response) => {

  Logger.verbose(`Request Content-Type`, req.get(`Content-Type`))
  Logger.verbose(
    `any`, req.is(`*/*`),
    `text`, req.is(`text/*`),
    `html`, req.is(`*/html`),
    `json`, req.is(`json`),
    `*/json`, req.is(`*/json`)
  )

  const contentType = res.get(`Content-Type`)
  Logger.verbose(`Response Content-Type`, contentType)

  return
}