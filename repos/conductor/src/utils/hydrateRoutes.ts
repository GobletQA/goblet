import { generateRoutes } from './generators'
import type { Controller } from '../controller'
import { TContainerInspect, TPortsMap } from '../types'
import { CONDUCTOR_SUBDOMAIN_LABEL } from '../constants'

type TPort = {
  HostIp:string
  HostPort:string
}
type TPorts = {
  [key:string]: TPort[]
}

const buildPorts = (ports:TPorts):TPortsMap => {
  return Object.entries(ports).reduce((acc, [cPortProto, hostData]) => {
    if(!hostData) return acc

    const cPort = cPortProto.split(`/`).shift()
    const hPort = (hostData.shift() || {})?.HostPort
    cPort && hPort && (acc[cPort] = hPort)

    return acc
  }, {})
}

export const routesFromContainer = (controller:Controller, container:TContainerInspect) => {
  const subdomain = container.Config.Labels[CONDUCTOR_SUBDOMAIN_LABEL]
  if(!subdomain) return

  controller.routes[subdomain] = generateRoutes(
    container,
    buildPorts(container.NetworkSettings.Ports),
    controller.conductor,
    subdomain
  )

}

export const hydrateRoutes = (
  controller:Controller,
  containers:Record<string, TContainerInspect>
) => {
  return Promise.all(
    Object.entries(containers)
      .map(([key, container]) => routesFromContainer(controller, container))
  )
}
