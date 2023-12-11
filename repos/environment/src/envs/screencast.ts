import type { TGenEnv } from "../types"

import { asNum } from "../utils/asNum"
import { asBool } from "../utils/asBool"


const screencast = (general:TGenEnv) => {
  const {
    GB_SC_HOST,
    GB_SC_IDLE_INTERVAL,
    GB_SC_IDLE_THRESHOLD,
    GB_SC_IDLE_TIMEOUT_ACTIVE,
    GB_SC_IDLE_WAIT_TO_START,
    GB_SC_IDLE_CONNECTION_THRESHOLD,
    GB_SC_WS_PATH=`/goblet-socket`,
    GB_SC_RESET_CONNECTION_FILE=`reset-connection-check`,

    GB_VNC_ACTIVE,
    GB_VNC_VIEW_WIDTH,
    GB_VNC_VIEW_HEIGHT,
    GB_VNC_SERVER_PORT,

    GB_NO_VNC_HOST=GB_SC_HOST,
    GB_VNC_SERVER_HOST=GB_SC_HOST,

    GB_DT_PROXY_PORT,
    GB_DT_REMOTE_DEBUG_PORT,
    GB_DT_REMOTE_BROWSER_ORIGINS,
  } = process.env

  return {

    GB_SC_HOST,
    GB_SC_WS_PATH,
    GB_SC_RESET_CONNECTION_FILE,
    GB_SC_IDLE_INTERVAL: asNum(GB_SC_IDLE_INTERVAL ?? 20),
    GB_SC_IDLE_THRESHOLD: asNum(GB_SC_IDLE_THRESHOLD ?? 2),
    GB_SC_IDLE_TIMEOUT_ACTIVE: asBool(GB_SC_IDLE_TIMEOUT_ACTIVE),
    GB_SC_IDLE_WAIT_TO_START: asNum(GB_SC_IDLE_WAIT_TO_START ?? 120),
    GB_SC_IDLE_CONNECTION_THRESHOLD: asNum(GB_SC_IDLE_CONNECTION_THRESHOLD ?? 2),

    GB_DT_REMOTE_BROWSER_ORIGINS,
    GB_DT_PROXY_PORT: asNum(GB_DT_PROXY_PORT ?? 19019),
    GB_DT_REMOTE_DEBUG_PORT: asNum(GB_DT_REMOTE_DEBUG_PORT ?? 19020),

    GB_NO_VNC_HOST,
    GB_VNC_SERVER_HOST,
    GB_VNC_ACTIVE: asBool(GB_VNC_ACTIVE),
    GB_VNC_SERVER_PORT: asNum(GB_VNC_SERVER_PORT ?? 26370),
    GB_VNC_VIEW_WIDTH: asNum(GB_VNC_VIEW_WIDTH, { exists: true, default: undefined }),
    GB_VNC_VIEW_HEIGHT: asNum(GB_VNC_VIEW_HEIGHT, { exists: true, default: undefined }),
  }
}

export default screencast