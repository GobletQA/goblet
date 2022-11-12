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
  `/sockr-socket`,
  `/sockr-socket/`,
]

