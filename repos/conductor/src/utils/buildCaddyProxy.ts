import type { Caddy } from '../caddy/caddy'
import { TRouteMeta, TCaddyApiServers } from '../types'

export const buildCaddyProxy = (
  caddy:Caddy,
  subdomain:string,
  route:TRouteMeta,
  servers:TCaddyApiServers
) => {
  const { map } = route
  
  console.log(`------- route -------`)
  console.log(route)
  console.log(`------- map -------`)
  console.log(map)
  
  const hostDomain = {
    host: [caddy.config.host],
  }

  const svrName = 'virtual.server'
  const svrPort = 'virtual.port'

  const domainHndlr = {
    handler: 'reverse_proxy',
    upstreams: [{ dial: `${svrName}:${svrPort}` }],
  }

  const handler = {
    handler: 'subroute',
    routes: [{ handle: [domainHndlr] }],
  }
  
  
  return {
    handle: [handler],
    match: [hostDomain],
  }
}