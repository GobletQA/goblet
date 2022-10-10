export const ConductorLabel = `com.gobletqa`
export const ConductorUserHashLabel = `${ConductorLabel}.conductor`
export const ForwardHostHeader = `x-goblet-host`
export const ForwardPortHeader = `x-goblet-port`
export const ForwardProtoHeader = `x-goblet-proto`
export const ForwardSubdomainHeader = `x-goblet-subdomain`
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
