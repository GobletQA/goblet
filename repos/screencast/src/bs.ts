import '../resolveRoot'
import type { EBrowserName, TBrowserConf } from '@GSC/types'

import { parseJSON, noOpObj } from '@keg-hub/jsutils'
import { DefaultBrowser, newServer } from '@gobletqa/browser'

/**
 * Runs the browser server that browsers connect to via websocket
 */
;(async () => {
  const [
    browserConfStr,
    browser=DefaultBrowser,
  ] = process.argv.slice(2)

  const browserConf = parseJSON(browserConfStr, false) || noOpObj
  await newServer(browser as EBrowserName, browserConf as TBrowserConf)

})()
