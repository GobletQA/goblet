import type { Caddy } from './caddy'
import { TRouteMeta } from '../types'
import { TCaddyApiServers } from '../types/caddy.types'

export const buildCaddyProxy = (
  caddy:Caddy,
  userHash:string,
  route:TRouteMeta,
  servers:TCaddyApiServers
) => {

  const hostDomain = {
    host: [caddy.config.host],
  }

  const svrName = 'virtual.server'
  const svrPort = 'virtual.port'

  const routeHndlr = {
    handler: 'reverse_proxy',
    upstreams: [{ dial: `${svrName}:${svrPort}` }],
  }

  const handler = {
    handler: 'subroute',
    routes: [{ handle: [routeHndlr] }],
  }
  
  
  return {
    handle: [handler],
    match: [hostDomain],
  }
}