const { deepFreeze, keyMap } = require('@keg-hub/jsutils')

export const ChildBrowserServerKey = `child-playwright-server`
export const defaultBrowser = 'chromium'
export const canRecordVideo = ['chromium']
export const browserStatus = keyMap([`stopped`, `running`, `starting`, `unknown`])
export const browserNames = deepFreeze([
  'chromium',
  'firefox',
  'webkit'
])

export const browserMap = {
  ...keyMap(browserNames),
  // Shortcuts to browser names
  ff: 'firefox',
  fox: 'firefox',
  wk: 'webkit',
  sa: 'webkit',
  safari: 'webkit',
  ch: 'chromium',
  chrome: 'chromium',
}

export const AUTH_BYPASS_ROUTES = [
  `/`,
  `/auth/validate`,
  `/health-check`,
  `/favicon.ico`,
  `/goblet-socket`,
  `/goblet-socket/`,
]


export const TagPrefix = `SOCKET`
export const authTokenHeader = `SOCKET-AUTH-TOKEN`

export const WSEventTypes = {
  // General
  INIT: `${TagPrefix}:INIT`,
  SET_ID: `${TagPrefix}:SET_ID`,
  CONNECT: `${TagPrefix}:CONNECT`,

  // STORE
  UPDATE_STORE: `${TagPrefix}:UPDATE_STORE`,

  // Auth
  AUTH_TOKEN: `${TagPrefix}:AUTH_TOKEN`,
  NOT_AUTHORIZED: `${TagPrefix}:NOT_AUTHORIZED`,

  // Peer
  ADD_PEER: `${TagPrefix}:ADD_PEER`,
  PEER_DISCONNECT: `${TagPrefix}:PEER_DISCONNECT`,

  // Command
  SET_CMDS: `${TagPrefix}:SET_CMDS`,
  RUN_CMD: `${TagPrefix}:RUN_CMD`,
  CMD_RUNNING: `${TagPrefix}:CMD_RUNNING`,
  CMD_END: `${TagPrefix}:CMD_END`,
  CMD_OUT: `${TagPrefix}:CMD_OUT`,
  CMD_ERR: `${TagPrefix}:CMD_ERR`,
  CMD_FAIL: `${TagPrefix}:CMD_FAIL`,
}