import type { TGenEnv } from "../types"

import { asNum } from "../utils/asNum"
import { asBool } from "../utils/asBool"


const screencast = (general:TGenEnv) => {
  const {
    GB_VNC_PASS,
    GB_VNC_ACTIVE,
    GB_VNC_VIEW_WIDTH,
    GB_VNC_VIEW_HEIGHT,
    GB_PW_SOCKET_ACTIVE,
    GB_REMOTE_DEBUG_PORT
  } = process.env

  return {
    GB_VNC_PASS,
    GB_VNC_ACTIVE: asBool(GB_VNC_ACTIVE),
    GB_PW_SOCKET_ACTIVE: asBool(GB_PW_SOCKET_ACTIVE),
    GB_REMOTE_DEBUG_PORT: asNum(GB_REMOTE_DEBUG_PORT ?? 9020),
    GB_VNC_VIEW_WIDTH: asNum(GB_VNC_VIEW_WIDTH, { exists: true, default: undefined }),
    GB_VNC_VIEW_HEIGHT: asNum(GB_VNC_VIEW_HEIGHT, { exists: true, default: undefined }),
  }
}

export default screencast