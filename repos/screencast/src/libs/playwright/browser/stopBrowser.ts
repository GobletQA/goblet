import type { TBrowserConf, TBrowserType } from '@GSC/types'

import { noOpObj } from '@keg-hub/jsutils'
import { browserStatus } from '@GSC/constants'
import { buildStatus } from '../helpers/buildStatus'
import { getBrowser, closeBrowser } from './browser'

/**
 * Closes the current browser reference
 * Resets all the cache holders to undefined
 * @function
 * @public
 */
export const stopBrowser = async (
  browserConf:TBrowserConf = noOpObj as TBrowserConf,
  type?:TBrowserType
) => {
  type = type || browserConf.type

  const browser = getBrowser(type)
  // Ensure the browser, page, and context are always reset
  browser && await closeBrowser(browser)

  return buildStatus(type, browserStatus.stopped)
}
