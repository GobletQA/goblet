import { keyMap, deepFreeze, toBool } from '@keg-hub/jsutils'

export const ForwardHeaders = deepFreeze({
  hostHeader: process.env.GB_CD_FORWARD_HOST_HEADER,
  portHeader: process.env.GB_CD_FORWARD_PORT_HEADER,
  routeHeader: process.env.GB_CD_FORWARD_ROUTE_HEADER,
  protoHeader: process.env.GB_CD_FORWARD_PROTO_HEADER,
  subdomainHeader: process.env.GB_CD_FORWARD_SUBDOMAIN_HEADER,
})

export const VNC_ACTIVE = toBool(process.env.GB_VNC_ACTIVE)
export const NO_VNC_PATH = process.env.GB_NO_VNC_PATH || '/novnc'
export const WS_CONFIG = JSON.parse(process.env.WS_SERVER_CONFIG || ``)
export const DEBUG_CONFIG = JSON.parse(process.env.DEBUG_PROXY_CONFIG || ``)

export const HttpMethods = deepFreeze(keyMap([
  `GET`,
  `POST`,
  `PATCH`,
  `PUT`,
  `DELETE`
], true))
