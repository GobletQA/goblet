const { toBool } = require('@keg-hub/jsutils')

const {
  GB_SC_HOST,
  GB_BE_HOST,
  GB_VNC_ACTIVE,
  DISPLAY=':0.0',
  GB_SC_PORT=7006,

  GB_NO_VNC_PORT=26369,
  GB_NO_VNC_PATH=`/novnc`,
  GB_NO_VNC_PROTOCOL=`ws`,
  GB_NO_VNC_SERVER_HOST=GB_BE_HOST,

  GB_VNC_VIEW_HEIGHT=900,
  GB_VNC_VIEW_WIDTH=1440,
  GB_VNC_SERVER_PORT=26370,
  GB_VNC_SERVER_HOST=GB_SC_HOST,
} = process.env


const screenDims = {
  width: parseInt(GB_VNC_VIEW_WIDTH, 10) ?? 900,
  height: parseInt(GB_VNC_VIEW_HEIGHT, 10) ?? 1440,
}

const screencastConfig = {
  // Set if the screencast is active or not
  active: toBool(GB_VNC_ACTIVE),
  // TODO - This should be moved from screencast to server config
  // Proxy settings, for connecting the backend API to the noVNC server
  proxy: {
    path: GB_NO_VNC_PATH,
    port: GB_NO_VNC_PORT,
    host: GB_NO_VNC_SERVER_HOST,
    protocol: GB_NO_VNC_PROTOCOL,
  },
  // Uses to start separate screencast API
  server: {
    port: GB_SC_PORT,
    host: GB_SC_HOST,
  },
  vnc: {
    display: DISPLAY,
    host: GB_VNC_SERVER_HOST,
    port: GB_VNC_SERVER_PORT,
    width: GB_VNC_VIEW_WIDTH,
    height: GB_VNC_VIEW_HEIGHT,
  },
  // Default playwright context settings
  context: {
    screen: screenDims,
    viewport: screenDims,
  },
  // Default playwright browser launch settings
  // TODO: add defaults here for Screencast
  browser: {},
}

module.exports = {
  screencastConfig,
}
