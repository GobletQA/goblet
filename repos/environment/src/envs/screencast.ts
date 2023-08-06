import type { TGenEnv } from "@GENV/types"

import { toBool } from "@keg-hub/jsutils"

export const screencast = (general:TGenEnv) => {
  const {

    GB_VNC_ACTIVE,
    GB_PW_SOCKET_ACTIVE,
    GB_SC_LOG_LEVEL=general.GB_LOG_LEVEL,
  } = process.env
  
  return {
    GB_SC_LOG_LEVEL,
    GB_VNC_ACTIVE: toBool(GB_VNC_ACTIVE),
    GB_PW_SOCKET_ACTIVE: toBool(GB_PW_SOCKET_ACTIVE),
  }
}
