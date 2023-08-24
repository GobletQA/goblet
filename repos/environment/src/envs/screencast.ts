import {toNum} from "@GENV/utils/helpers"
import type { TGenEnv } from "../types"

import { asBool } from "../utils/asBool"

const screencast = (general:TGenEnv) => {
  const {
    GB_VNC_ACTIVE,
    GB_PW_SOCKET_ACTIVE,
    GB_REMOTE_DEBUG_PORT
  } = process.env

  return {
    GB_VNC_ACTIVE: asBool(GB_VNC_ACTIVE),
    GB_PW_SOCKET_ACTIVE: asBool(GB_PW_SOCKET_ACTIVE),
    GB_REMOTE_DEBUG_PORT: toNum(GB_REMOTE_DEBUG_PORT ?? 9020)
  }
}

export default screencast