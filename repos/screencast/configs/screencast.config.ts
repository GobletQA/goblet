import { toBool } from '@keg-hub/jsutils'
import { TScreenDims, TGScreencastConfig } from '@gobletqa/screencast/src/types'

const {
  GB_SC_HOST,
  GB_VNC_ACTIVE,
  DISPLAY=':0.0',
  GB_SC_PORT,
  GB_NO_VNC_PORT,

  GB_VNC_VIEW_HEIGHT,
  GB_VNC_VIEW_WIDTH,
  GB_VNC_SERVER_PORT,
  GB_VNC_SERVER_HOST=GB_SC_HOST,
} = process.env

const screenDims:TScreenDims = {
  width: parseInt(GB_VNC_VIEW_WIDTH as string, 10) ?? 900,
  height: parseInt(GB_VNC_VIEW_HEIGHT as string, 10) ?? 1440,
}

export const screencastConfig:TGScreencastConfig = {
  // Uses to start separate screencast API
  server: {
    port: GB_SC_PORT,
    host: GB_SC_HOST,
  },
  screencast: {
    // Set if the screencast is active or not
    active: toBool(GB_VNC_ACTIVE),
    // Default playwright browser launch settings
    // TODO: add defaults here for Screencast
    browser: {},
    // Default playwright context settings
    context: {
      screen: screenDims,
      viewport: screenDims,
    },
    novnc: {
      host: GB_SC_HOST,
      port: GB_NO_VNC_PORT,
    },
    vnc: {
      display: DISPLAY,
      host: GB_VNC_SERVER_HOST,
      port: GB_VNC_SERVER_PORT,
      width: GB_VNC_VIEW_WIDTH,
      height: GB_VNC_VIEW_HEIGHT,
    },
  }
}

