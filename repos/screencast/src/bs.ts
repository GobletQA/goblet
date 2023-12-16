import '../resolveRoot'
import type { EBrowserName, TBrowserConf } from '@gobletqa/shared/types'

import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { parseJSON } from '@keg-hub/jsutils/parseJSON'
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
