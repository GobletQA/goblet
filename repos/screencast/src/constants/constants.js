const { deepFreeze, keyMap } = require('@keg-hub/jsutils')

const browserNames = [
  'chromium',
  'firefox',
  'webkit'
]

/**
 * Global constants for the screencast app
 * @type {Object}
 */
const constants = deepFreeze({
  browserNames,
  defaultBrowser: 'chromium',
  canRecordVideo: ['chromium'],
  browserMap: {
    ...keyMap(browserNames),
    // Shortcuts to browser names
    ff: 'firefox',
    fox: 'firefox',
    wk: 'webkit',
    sa: 'webkit',
    safari: 'webkit',
    ch: 'chromium',
    chrome: 'chromium',
  },
  browserStatus: keyMap([`stopped`, `running`, `starting`, `unknown`]),
  
  AUTH_BYPASS_ROUTES: [
    `/`,
    `/auth/validate`,
    `/health-check`,
    `/favicon.ico`,
    `/sockr-socket`,
    `/sockr-socket/`,
  ]
})

module.exports = constants
