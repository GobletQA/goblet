import { deepFreeze, keyMap } from '@keg-hub/jsutils'
export * from '@gobletqa/shared/constants/websocket'

export const ChildBrowserServerKey = `child-playwright-server`
export const defaultBrowser = 'chromium'
export const canRecordVideo = ['chromium']
export const browserStatus = keyMap([`stopped`, `running`, `starting`, `unknown`])
export const browserNames = deepFreeze<string[]>([
  'chromium',
  'firefox',
  'webkit'
])

export const browserMap = {
  ...keyMap(browserNames),
  // Shortcuts to browser names
  ff: `firefox`,
  fox: `firefox`,
  wk: `webkit`,
  sa: `webkit`,
  safari: `webkit`,
  ch: `chromium`,
  chrome: `chromium`,
}

export const AUTH_BYPASS_ROUTES = [
  `/`,
  `/auth/validate`,
  `/health-check`,
  `/favicon.ico`,
  `/goblet-socket`,
  `/goblet-socket/`,
]

export const PWLogFilter = [
  // Disabled these for now, until figure out whats needed
  // Need to figure out how to pipe pw:channel events?
  `SEND ► {`,
  `◀ RECV {`,
  `pw:channel:`,
  `dri3 extension not supported`,
  `Failed to connect to the bus`,
  `Failed to adjust OOM score of renderer`,
]