import type { ClientRequest, IncomingMessage } from 'http'
import type { Request, Response } from 'express'
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
    .forEach(key => res.append(key, proxyRes.headers[key]))
}


export const iframeHeaders = (proxyRes:IncomingMessage, origin:string) => {
  addAllowOriginHeader(proxyRes, origin)
  delete proxyRes.headers[`x-frame-options`]

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


export const replaceResponseText = async (
  responseText:string,
  upstreamDomain:string,
  localDomain:string,
  rules:Record<string, string>
) => {

  const regexp_upstreamHostname = new RegExp('{upstream_hostname}', 'g')
  const regexp_proxyHostname = new RegExp('{proxy_hostname}', 'g')

  if (rules) {
    for (let key in rules) {
      let rule = rules[key]

      key = key.replace(regexp_upstreamHostname, upstreamDomain)
      key = key.replace(regexp_proxyHostname, localDomain)
      rule = rule.replace(regexp_upstreamHostname, upstreamDomain)
      rule = rule.replace(regexp_proxyHostname, localDomain)
      responseText = responseText.replace(new RegExp(key, 'g'), rule)
    }
  }

  return responseText
}