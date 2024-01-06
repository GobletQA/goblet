import { conductorHeaders } from '@GCD/configs/conductor.headers.config'

export const ConductorLabel = `com.gobletqa`
export const ConductorUserHashLabel = `${ConductorLabel}.conductor`
export const ForwardHostHeader = conductorHeaders.hostHeader
export const ForwardPortHeader = conductorHeaders.portHeader
export const ForwardRouteHeader = conductorHeaders.routeHeader
export const ForwardProtoHeader = conductorHeaders.protoHeader
export const ForwardSubdomainHeader = conductorHeaders.subdomainHeader
export const DevUserHash = `goblet-dev-user`

export const ContainerLabels = [
  `idle`,
  `timeout`,
  `rateLimit`
]

export const PodAnnotations = {
  name: `${ConductorLabel}.name`,
  ports: `${ConductorLabel}.ports`,
  component: `${ConductorLabel}.component`,
}
