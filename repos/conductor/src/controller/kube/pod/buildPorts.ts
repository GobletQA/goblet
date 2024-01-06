import type {
  TPortObj,
  TPortItem,
  TPodContainer,
} from '@gobletqa/shared/types'
import type { V1ContainerPort } from '@kubernetes/client-node'

import { toNum } from '@keg-hub/jsutils/toNum'
import { isObj } from '@keg-hub/jsutils/isObj'
import { isBool } from '@keg-hub/jsutils/isBool'
import { isArr } from '@keg-hub/jsutils/isArr'

const getPortObj = (key:string, portItem:TPortObj|string|number|boolean) => {
  return isObj<TPortObj>(portItem)
    ? portItem
    : isBool(portItem) && portItem
      ? { port: key } as TPortObj
      : portItem
        ? { port: (portItem as string|number) } as TPortObj
        : {} as TPortObj
}

export const buildPorts = (
  container:TPodContainer,
  opts?:any
):V1ContainerPort[] => {
  const portsObj = isArr<TPortItem[]>(container.ports)
    ? (container.ports as TPortItem[]).reduce((acc, item) => {
        const built = isObj(item) ? item : { containerPort: item }
        
        acc[built.containerPort] = item

        return acc
      }, {})
    : container.ports
   
  return Object.entries(portsObj)
    .map(([key, portItem]:[string, TPortItem]) => {
      const {
        port,
        name,
        hostIP,
        hostPort,
        protocol,
        containerPort
      } = getPortObj(key, portItem)

      const contPort = toNum(containerPort || port)
      if(!contPort) return
      
      const builtPort:V1ContainerPort = { containerPort: contPort } as any

      // If used, it must be an IANA_SVC_NAME. Would need to investigate IANA_SVC_NAME
      name && (builtPort.name = name)
      hostIP && (builtPort.hostIP = hostIP)
      // Must be one of TCP | UDP | SCTP
      protocol && (builtPort.protocol = protocol)
      // Must be between 0 < x < 65536
      hostPort && (builtPort.hostPort = toNum(hostPort))

      return builtPort
    }).filter(Boolean)
}