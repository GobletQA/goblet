import {toBool} from "@keg-hub/jsutils"


const {
  FORCE_COLOR=`1`,
  GB_SUB_REPO,
  GOBLET_TEST_COLORS=FORCE_COLOR,
  GB_LOG_LEVEL=`info`,
  GB_SC_LOG_LEVEL=GB_LOG_LEVEL,

  DISPLAY,
  GB_VNC_ACTIVE,
  GB_PW_SOCKET_ACTIVE

} = process.env

// TODO: update so these are getters and settings
// So the value is in real time, and not on initial load

// Single location export of all envs that other repos reuse
export const ENVS = {
  GB_LOG_LEVEL,
  GB_SUB_REPO,
  GB_SC_LOG_LEVEL,
  GOBLET_TEST_COLORS,

  DISPLAY,
  GB_VNC_ACTIVE: toBool(GB_VNC_ACTIVE),
  GB_PW_SOCKET_ACTIVE: toBool(GB_PW_SOCKET_ACTIVE),
}