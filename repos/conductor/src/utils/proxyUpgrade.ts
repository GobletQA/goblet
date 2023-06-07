import type { Socket } from 'net'
import type { Conductor } from '../conductor'
import type { Request } from 'http-proxy-middleware/dist/types.d'
import type { HttpProxyMiddleware } from 'http-proxy-middleware/dist/http-proxy-middleware'

import { conductorHeaders } from '@GCD/configs/conductor.headers.config'
import {ForwardSubdomainHeader} from '@GCD/constants'


const { GB_CD_FORWARD_SUBDOMAIN_HEADER } = process.env
const subdomainKey = conductorHeaders.subdomainHeader || GB_CD_FORWARD_SUBDOMAIN_HEADER

type TProxies = {
  apiProxy?:HttpProxyMiddleware
  wsProxy?:HttpProxyMiddleware
  vncProxy?:HttpProxyMiddleware
}

export const proxyUpgrade = (conductor:Conductor, proxies:TProxies) => {

  const { vncProxy, wsProxy } = proxies

  const onUpgrade = (req:Request, socket:Socket, head:any) => {
    const containerMaps = conductor.controller.containerMaps

    const url = new URL(`https://empty.co${req.url}`)
    const id = url.searchParams.get(`routeId`)
    const userHash = url.searchParams.get(subdomainKey)
    const mapExists = Boolean(containerMaps[id] || containerMaps[userHash])

    if(!mapExists) return

    // @ts-ignore
    req.url.includes(vncProxy?.middleware?.path)
      ? vncProxy?.middleware?.upgrade(req, socket, head)
      : wsProxy?.middleware?.upgrade(req, socket, head)
    
  }

  return {...proxies, onUpgrade}
}