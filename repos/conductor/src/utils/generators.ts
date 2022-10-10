import type { Conductor } from '@gobletqa/conductor/conductor'
import { inDocker } from '@keg-hub/cli-utils'
import {
  FORWARD_HOST_HEADER,
  FORWARD_PORT_HEADER,
  FORWARD_PROTO_HEADER,
  FORWARD_SUBDOMAIN_HEADER
} from '@GCD/constants'
import {
  TPort,
  TPortsMap,
  TUserHash,
  TRouteMeta,
  TPublicUrls,
  TContainerMeta,
  TContainerInspect
} from '@gobletqa/conductor/types'
const isDocker = inDocker()

/**
 * Figure out a better way to set http vs https
 */
const getProtocol = (port:TPort) => {
  return (port === `443` || port === 443) ? `https:` : `http:`
}

/**
 * Generates a host url for accessing an exposed container on the dind pod
 */
export const generateExternalUrl = (
  hostPort:TPort,
  userHash:TUserHash,
  conductor:Conductor,
) => {
  const { domain, subdomain } = conductor?.config
  return `${hostPort}.${userHash}.${subdomain}.${domain}`
}


/**
 * Builds a route used by the proxy to forward requests
 */
export const generateRoute = (
  cPort:TPort,
  hostPort:TPort,
  conductor:Conductor,
  userHash:TUserHash
) => {

  const proxyPort = conductor?.config?.proxy?.port
  const proto = getProtocol(cPort)
  const { host:dockerHost } = conductor?.controller?.config?.options
  const host = !isDocker || !dockerHost || dockerHost.includes(`docker.sock`)
    ? conductor?.config?.domain
    : dockerHost

  return {
    host,
    port: proxyPort,
    containerPort: hostPort,
    // TODO: figure out a way to check if port is secure for ports
    // 443 is default, but would be better to allow it to be any port
    protocol: proto,
    headers: {
      [FORWARD_PORT_HEADER]: cPort,
      [FORWARD_PROTO_HEADER]: proto,
      [FORWARD_SUBDOMAIN_HEADER]: userHash,
      [FORWARD_HOST_HEADER]: generateExternalUrl(hostPort, userHash, conductor)
    },
  }
}

/**
 * Builds the external urls for accessing the container
 */
export const generateExternalUrls = (
  ports:TPortsMap,
  userHash:TUserHash,
  conductor:Conductor
) => {

  return Object.entries(ports).reduce((acc, [cPort, hostPort]:[string, string]) => {
    acc[cPort] = generateExternalUrl(ports[cPort], userHash, conductor)

    return acc
  }, {} as TPublicUrls)

}

/**
 * Loops over the possible ports and generates uris for them relative to the IP || domain
 * @function
 * @public
 * @param {Object} containerInfo - JSON object instance of a container inspect returned from dockerode
 *
 * @returns {Object} - Generated Uris to access the container
 */
export const generateRoutes = (
  ports:TPortsMap,
  conductor:Conductor,
  userHash:TUserHash,
  meta?: Partial<TContainerMeta>
):TRouteMeta => {

  return Object.entries(ports)
    .reduce((acc, [cPort, hostPort]:[string, string]) => {
      acc.routes[cPort] = generateRoute(cPort, hostPort, conductor, userHash)

      return acc
    }, { routes: {}, meta } as TRouteMeta)
}

