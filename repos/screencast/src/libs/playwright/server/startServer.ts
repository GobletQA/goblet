import type { TBrowserConf } from '@GSC/types'

import { newServer } from './newServer'
import { noOpObj, wait } from '@keg-hub/jsutils'
import { Logger } from '@GSC/utils/logger'
import { checkServerPid } from './checkServerPid'
import { getBrowserType } from '../helpers/getBrowserType'


/**
 * Starts browser-server using playwright
 * See {@link https://playwright.dev/docs/api/class-browsertype#browser-type-launch-server|Playwright Docs} for more info
 */
export const startServer = async (
  browserConf:TBrowserConf = noOpObj as TBrowserConf,
) => {
  const browser = getBrowserType(browserConf.type)
  const found = await checkServerPid(browser)

  !found && await newServer(browser, browserConf)
}
