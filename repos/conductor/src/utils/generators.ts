import type { Conductor } from '@GCD/conductor'
import {
  ForwardHostHeader,
  ForwardPortHeader,
  ForwardProtoHeader,
  ForwardRouteHeader,
  ForwardSubdomainHeader
} from '@GCD/constants'
import {
  TPort,
  TPortsMap,
  TUserHash,
  TGenRoute,
  TRouteMeta,
  TGenRoutes,
  TProxyRoute,
  TPublicUrls,
} from '@GCD/types'


/**
 * Figure out a better way to set http vs https
 */
const getProtocol = (port:TPort) => {
  return (port === `443` || port === 443) ? `https:` : `http:`
}

/**
 * Generates a host url for accessing an exposed container on the  pod
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
export const generateRoute = ({
  meta,
  hostPort,
  userHash,
  conductor,
  containerPort:cPort,
}:TGenRoute) => {

  const proxyPort = conductor?.controller?.config?.type === `Kube`
    ? hostPort
    : conductor?.config?.proxy?.port

  const proto = getProtocol(cPort)

  return {
    host: meta?.host,
    port: proxyPort,
    containerPort: hostPort,
    // TODO: figure out a way to check if port is secure for ports
    // 443 is default, but would be better to allow it to be any port
    protocol: proto,
    headers: {
      [ForwardPortHeader]: cPort,
      [ForwardProtoHeader]: proto,
      [ForwardRouteHeader]: meta.id,
      [ForwardSubdomainHeader]: userHash,
      [ForwardHostHeader]: generateExternalUrl(hostPort, userHash, conductor)
    },
  } as TProxyRoute
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
export const generateRoutes = ({
  meta,
  ports,
  userHash,
  conductor,
}:TGenRoutes):TRouteMeta => {

  return Object.entries(ports)
    .reduce((acc, [cPort, hostPort]:[string, string]) => {
      acc.routes[cPort] = generateRoute({
        meta,
        userHash,
        hostPort,
        conductor,
        containerPort: cPort,
      })

      return acc
    }, { routes: {}, meta } as TRouteMeta)
}

