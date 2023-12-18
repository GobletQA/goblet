import type { Socket } from 'net'
import type { Conductor } from '../conductor'
import type { HttpProxyMiddleware } from '@GCD/types'
import type { Request } from 'http-proxy-middleware/dist/types.d'
import { conductorHeaders } from '@GCD/configs/conductor.headers.config'


const {
  GB_CD_FORWARD_ROUTE_HEADER,
  GB_CD_FORWARD_SUBDOMAIN_HEADER
} = process.env
const routeKey = conductorHeaders.routeHeader || GB_CD_FORWARD_ROUTE_HEADER
const subdomainKey = conductorHeaders.subdomainHeader || GB_CD_FORWARD_SUBDOMAIN_HEADER


type TProxies = {
  apiProxy?:HttpProxyMiddleware
  wsProxy?:HttpProxyMiddleware
  vncProxy?:HttpProxyMiddleware
  debugProxy?:HttpProxyMiddleware
}

export const proxyUpgrade = (conductor:Conductor, proxies:TProxies) => {

  const { vncProxy, wsProxy, debugProxy } = proxies

  const onUpgrade = (req:Request, socket:Socket, head:any) => {
    if(!conductor.controller.devRouterActive){
      const searchParams = new URLSearchParams(req.url.replace(/.*?\?/, ``))
      const containerMaps = conductor.controller.containerMaps

      const routeId = searchParams.get(routeKey)
      const userHash = searchParams.get(subdomainKey)
      const mapExists = Boolean(containerMaps[routeId] || containerMaps[userHash])

      if(!mapExists) return
    }

    // @ts-ignore
    if(req.url.includes(vncProxy?.middleware?.path))
      vncProxy?.middleware?.upgrade(req, socket, head)

    // @ts-ignore
    else if(req.url.includes(wsProxy?.middleware?.path))
      wsProxy?.middleware?.upgrade(req, socket, head)

    // @ts-ignore
    else if(req.url.includes(debugProxy?.middleware?.path))
      debugProxy?.middleware?.upgrade(req, socket, head)

  }

  return {...proxies, onUpgrade}
}