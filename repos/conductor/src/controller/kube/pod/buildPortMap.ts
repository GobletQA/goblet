import type { V1ContainerPort } from '@kubernetes/client-node'


// Create a map of the ports that will be used for routing requests
export const buildPortMap = (ports: V1ContainerPort[]) => {
  return ports.reduce((acc, port) => {
    acc[port.containerPort] = port.hostPort || port.containerPort
    return acc
  }, {})
}
