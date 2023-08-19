import type { Socket } from 'net'
import type { Conductor } from '../conductor'
import type { Request } from 'http-proxy-middleware/dist/types.d'
import { conductorHeaders } from '@GCD/Configs/conductor.headers.config'
import type { HttpProxyMiddleware } from 'http-proxy-middleware/dist/http-proxy-middleware'


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
}

export const proxyUpgrade = (conductor:Conductor, proxies:TProxies) => {

  const { vncProxy, wsProxy } = proxies

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
    req.url.includes(vncProxy?.middleware?.path)
      ? vncProxy?.middleware?.upgrade(req, socket, head)
      : wsProxy?.middleware?.upgrade(req, socket, head)
    
  }

  return {...proxies, onUpgrade}
}