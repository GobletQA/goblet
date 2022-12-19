import '../resolveRoot'

import { defaultBrowser } from './constants'
import { parseJSON, noOpObj } from '@keg-hub/jsutils'
import { newServer } from './libs/playwright/server/newServer'

/**
 * Runs the browser server that browsers connect to via websocket
 */
;(async () => {
  const [
    browserConfStr,
    browser=defaultBrowser,
  ] = process.argv.slice(2)

  const browserConf = parseJSON(browserConfStr, false) || noOpObj
  await newServer(browser, browserConf)

})()