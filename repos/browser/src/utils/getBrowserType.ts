import type { EBrowserType, EBrowserName } from '@gobletqa/shared/enums'

import { Logger } from '@GBB/utils/logger'
import { exists } from '@keg-hub/jsutils/exists'
import { isEmpty } from '@keg-hub/jsutils/isEmpty'
import { DefaultBrowser, BrowserMap } from '@GBB/constants'

/**
 * Checks the passed in browserType to ensure it the correct name
 * If no type is passed, then uses the DefaultBrowser ( chromium )
 * @function
 */
export const getBrowserType = (type:EBrowserType|EBrowserName, log?:boolean) => {
  if (!exists(type) || isEmpty(type)) {
    log &&
      Logger.warn(
        `Browser type not defined, using default browser => ${DefaultBrowser}`
      )
    return DefaultBrowser as EBrowserName
  }

  if (!BrowserMap[type]) {
    log &&
      Logger.warn(
        `The browser ${type} is not allowed. Must be one of ${Object.keys(
          BrowserMap
        ).join(' | ')}`
      )
    return DefaultBrowser as EBrowserName
  }

  return BrowserMap[type] as EBrowserName
}
