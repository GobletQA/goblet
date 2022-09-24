import { deepFreeze, toBool } from '@keg-hub/jsutils'

export const VNC_ACTIVE = toBool(process.env.GB_VNC_ACTIVE)
export const NO_VNC_PATH = process.env.GB_NO_VNC_PATH || '/novnc'
export const WS_CONFIG = JSON.parse(process.env.WS_SERVER_CONFIG || ``)
export const HTTP_METHODS = deepFreeze([
  `GET`,
  `POST`,
  `PATCH`,
  `PUT`,
  `DELETE`
])