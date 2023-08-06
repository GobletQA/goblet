import type { TGenEnv } from "@GENV/types"

import { asBool } from "@GENV/utils/asBool"

const screencast = (general:TGenEnv) => {
  const {
    GB_VNC_ACTIVE,
    GB_PW_SOCKET_ACTIVE,
  } = process.env

  return {
    GB_VNC_ACTIVE: asBool(GB_VNC_ACTIVE),
    GB_PW_SOCKET_ACTIVE: asBool(GB_PW_SOCKET_ACTIVE),
  }
}

export default screencast