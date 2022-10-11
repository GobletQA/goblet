import type {
  TPortsMap,
  THostPorts,
  TContainerMap,
  TContainerInspect,
} from '../../../types'
import type { Docker } from '../docker'
import { resolveHost } from './resolveHost'


export const buildPorts = (ports:THostPorts):TPortsMap => {
  return Object.entries(ports).reduce((acc, [cPortProto, hostData]) => {
    if(!hostData) return acc

    const cPort = cPortProto.split(`/`).shift()
    const hPort = (hostData.shift() || {})?.HostPort
    cPort && hPort && (acc[cPort] = hPort)

    return acc
  }, {})
}

export const buildContainerMap = (container:TContainerInspect, controller:Docker) => {
  return {
    id: container.Id,
    name: container.Name,
    image: container.Image,
    host: resolveHost(controller),
    state: container.State.Status,
    labels: container.Config.Labels,
    ports: buildPorts(container.NetworkSettings.Ports),
  } as TContainerMap
}