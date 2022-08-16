import type { Conductor } from '@gobletqa/conductor/conductor'

import { resolveIp } from './resolveIp'
import { inDocker } from '@keg-hub/cli-utils'
import { buildSubdomains } from './buildSubdomains'
import { TPublicUrls, TRouteMeta, TPortsMap, TContainerInspect } from '../types'
const isDocker = inDocker()

const getProtocol = (port:string) => {
  return port === `443` ? `https:` : `http:`
}

/**
 * Builds a route used by the proxy to forward requests
 */
const buildRoute = (
  containerInfo:TContainerInspect,
  cPort:string,
  hPort:string|number,
  conductor:Conductor
) => {

  // TODO: Update this to find the domain when deploy instead of the IP address
  // ipAddress should be something like <app-subdomain>.<goblet-QA-domain>.run
  const ipAddress = conductor?.controller?.config?.options?.host
  const host = !isDocker || !ipAddress || ipAddress.includes(`docker.sock`)
    ? resolveIp(containerInfo) || conductor?.domain
    : ipAddress

  return {
    host,
    port: hPort,
    // port: isDocker ? cPort : hPort,
    // TODO: figure out a way to check if port is secure for ports
    // 443 is default, but would be better to allow it to be any port
    protocol: getProtocol(cPort)
  }
}

/**
 * Builds the external urls for accessing the container
 */
export const generateExternalUrls = (
  ports:TPortsMap,
  subdomain:string,
  conductor:Conductor
) => {

  const sPort = conductor?.config?.server?.port
  return Object.entries(ports).reduce((acc, [cPort, hPort]:[string, string]) => {
    const protocol = getProtocol(cPort)
    acc[cPort] = `${protocol}//${cPort}.${subdomain}.${buildSubdomains(``)}.${conductor?.domain}:${sPort}`

    return acc
  }, {} as TPublicUrls)

}

/**
 * Loops over the possible ports and generates uris for them relative to the IP ||domain
 * @function
 * @public
 * @param {Object} containerInfo - JSON object instance of a container inspect returned from dockerode
 *
 * @returns {Object} - Generated Uris to access the container
 */
export const generateUrls = (
  containerInfo:TContainerInspect,
  ports:TPortsMap,
  conductor:Conductor,
  subdomain?:string
):TRouteMeta => {
  const domain = conductor?.domain


  const generated = Object.entries(ports)
    .reduce((acc, [cPort, hPort]:[string, string]) => {
      const route = buildRoute(containerInfo, cPort, hPort, conductor)
      // Build the route, that the proxy should route to => i.e. forward incoming traffic to here
      // internal: `${route.protocol}//${route.host}:${route.port}`,
      const internal = isDocker
          ? `${route.protocol}//${route.host}:${route.port}`
          : `${route.protocol}//${domain}:${route.port}`
          
      acc.map[cPort] = { route, internal }

      return acc
    }, {
      map: {},
      meta: {
        id: containerInfo.Id,
        name: containerInfo.Name,
      }
    } as TRouteMeta)

  if(subdomain)
    generated.urls = generateExternalUrls(ports, subdomain, conductor)

  return generated
}

