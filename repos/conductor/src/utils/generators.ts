import type { Conductor } from '@gobletqa/conductor/conductor'

import { resolveIp } from './resolveIp'
import { inDocker } from '@keg-hub/cli-utils'
import { buildSubdomains } from './buildSubdomains'
import { TPort, TPublicUrls, TRouteMeta, TPortsMap, TContainerInspect } from '../types'
const isDocker = inDocker()

const getProtocol = (port:TPort) => {
  return (port === `443` || port === 443) ? `https:` : `http:`
}

/**
 * Generates a host domain url for accessing an exposed container on the dind pod
 */
export const generateExternalUrl = (
  hostPort:TPort,
  subdomain:string,
  domain:string
) => {
  return `${hostPort}.${subdomain}.${buildSubdomains(``)}.${domain}`
}


/**
 * Builds a route used by the proxy to forward requests
 */
const buildRoute = (
  containerInfo:TContainerInspect,
  cPort:string,
  hostPort:string|number,
  conductor:Conductor,
  subdomain:string
) => {

  // TODO: Update this to find the domain when deploy instead of the IP address
  // dockerHost should be something like <app-subdomain>.<goblet-QA-domain>.run
  const { host:dockerHost, port } = conductor?.controller?.config?.options
  const host = !isDocker || !dockerHost || dockerHost.includes(`docker.sock`)
    ? resolveIp(containerInfo) || conductor.domain
    : dockerHost

  return {
    host,
    port: port,
    containerPort: hostPort,
    // TODO: figure out a way to check if port is secure for ports
    // 443 is default, but would be better to allow it to be any port
    protocol: getProtocol(cPort),
    headers: {
      Host: generateExternalUrl(hostPort, subdomain, conductor.domain)
    },
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

  return Object.entries(ports).reduce((acc, [cPort, hostPort]:[string, string]) => {
    acc[cPort] = generateExternalUrl(ports[cPort], subdomain, conductor?.domain)

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
export const generateRoutes = (
  containerInfo:TContainerInspect,
  ports:TPortsMap,
  conductor:Conductor,
  subdomain:string
):TRouteMeta => {

  return Object.entries(ports)
    .reduce((acc, [cPort, hostPort]:[string, string]) => {
      const route = buildRoute(containerInfo, cPort, hostPort, conductor, subdomain)

      acc.routes[cPort] = route

      return acc
    }, {
      routes: {},
      meta: {
        id: containerInfo.Id,
        name: containerInfo.Name,
      }
    } as TRouteMeta)
}

