import '../resolveRoot'
import type { EBrowserName, TBrowserConf } from '@GSC/types'

import { parseJSON, noOpObj } from '@keg-hub/jsutils'
import { defaultBrowser } from '@gobletqa/shared/constants'
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
  await newServer(browser as EBrowserName, browserConf as TBrowserConf)

})()
