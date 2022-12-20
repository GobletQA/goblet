import type { EBrowserType, EBrowserName } from '@GSC/types'

import { browserMap, defaultBrowser } from '@GSC/constants'
import { Logger } from '@GSC/utils/logger'
import { exists, isEmpty } from '@keg-hub/jsutils'

/**
 * Checks the passed in browserType to ensure it the correct name
 * If no type is passed, then uses the defaultBrowser ( chromium )
 * @function
 */
export const getBrowserType = (type:EBrowserType|EBrowserName, log?:boolean) => {
  if (!exists(type) || isEmpty(type)) {
    log &&
      Logger.warn(
        `Browser type not defined, using default browser => ${defaultBrowser}`
      )
    return defaultBrowser as EBrowserName
  }

  if (!browserMap[type]) {
    log &&
      Logger.warn(
        `The browser ${type} is not allowed. Must be one of ${Object.keys(
          browserMap
        ).join(' | ')}`
      )
    return defaultBrowser as EBrowserName
  }

  return browserMap[type] as EBrowserName
}
