import type { TGenEnv } from "../types"

import { asBool } from "../utils/asBool"

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