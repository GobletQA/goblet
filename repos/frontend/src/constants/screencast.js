import { isVNCMode } from 'GBUtils/isVNCMode'
import { getVncPath } from 'GBUtils/getVncPath'

import { deepFreeze } from '@keg-hub/jsutils'

const activeVNC = isVNCMode()
const noVncPath = getVncPath()



export const screencast = deepFreeze({
  VNC_ACTIVE: activeVNC,
  NO_VNC_PATH: noVncPath,
  SCREENCAST_DEFAULTS: {
    lastCheck: false,
  },
  BROWSER_DEFAULTS: {
    restart: true,
    // TODO: Add browser options here
  },
  RECORD_ACTIONS: {
    STOP:`stop`,
    START:`start`,
  },
  PLAY_ACTIONS: {
    STOP:`stop`,
    START:`start`,
  }
})
