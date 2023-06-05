import type { createProxyMiddleware } from 'http-proxy-middleware'
import { HttpProxyMiddleware } from 'http-proxy-middleware/dist/http-proxy-middleware'

type TCreateProxyParams = Parameters<typeof createProxyMiddleware>

export const createProxy = (...args:TCreateProxyParams) => {
  const httpProxy = new HttpProxyMiddleware(...args)
  return httpProxy
}