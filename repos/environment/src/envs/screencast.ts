import type { TGenEnv } from "@GENV/types"

import { toBool } from "@keg-hub/jsutils"
const {
  GB_VNC_ACTIVE,
  GB_PW_SOCKET_ACTIVE,
} = process.env


const screencast = (general:TGenEnv) => {
  return {
    GB_VNC_ACTIVE: toBool(GB_VNC_ACTIVE),
    GB_PW_SOCKET_ACTIVE: toBool(GB_PW_SOCKET_ACTIVE),
  }
}

export default screencast