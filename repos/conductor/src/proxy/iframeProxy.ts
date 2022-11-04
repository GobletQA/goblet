import type { IncomingMessage } from 'http'
import type { Request, Response, Router } from 'express'
import type { TProxyOpts } from '@gobletqa/shared/types'

import { exists } from '@keg-hub/jsutils'
import { getOrigin } from '@gobletqa/shared/utils/getOrigin'
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware'

import {
  iframeResHeaders,
  iframeReqHeaders,
} from './proxyHelpers'

import { uriReplacer } from './uriReplacer'

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
const onProxyError = (err:Error, req:Request, res:Response, proxyHost:string) => {
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
export const createIframeProxy = (config:TProxyOpts, ProxyRouter?:Router) => {
  const { target, protocol, host, headers, path, port } = config

  const addHeaders = ensureHeaders({ ...headers, ...(headers || {}) })
  const url = port ? `${host}:${port}` : host
  const pxTarget = target || `${protocol}://${url}`

  const iframeProxy = createProxyMiddleware(path, {
    ws: true,
    secure: false,
    logLevel: 'info',
    target: pxTarget,
    ignorePath: true,
    // autoRewrite: true,
    changeOrigin: true,
    onError: onProxyError,
    followRedirects: true,
    selfHandleResponse: true,
    headers: addHeaders,
    router: (req:Request) => {
      const reqUrl = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
      const proxyUrl = new URL(reqUrl.searchParams.get(`url`))

      return {
        host: proxyUrl.host,
        hash: proxyUrl.hash,
        search: proxyUrl.search,
        origin: proxyUrl.origin,
        protocol: proxyUrl.protocol,
        hostname: proxyUrl.hostname,
        pathname: proxyUrl.pathname,
        port: proxyUrl.port || proxyUrl.protocol === 'https:' ? 443 : 80
      }

    },
    // onProxyReq: (proxyReq, req:Request, res:Response) => {
    //   iframeReqHeaders(proxyReq, req, addHeaders)
    // },
    onProxyRes: responseInterceptor(async (
      buffer,
      proxyRes:IncomingMessage,
      req:Request,
      res:Response,
    ) => {
      
      const origin = getOrigin(req)
      iframeResHeaders(proxyRes, res, origin)
      const responseText = buffer.toString('utf8')

      return responseText

      // const replaced = uriReplacer(responseText, replaceUri)
      // const hostDomain = req.get('host')
      // const origin = getOrigin(req)
      // iframeHeaders(proxyRes, origin)

      // return responseText
    }),
  })

  ProxyRouter && ProxyRouter.use(iframeProxy)

  // @ts-ignore
  iframeProxy.path = path

  return iframeProxy
}