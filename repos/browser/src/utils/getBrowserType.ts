import type { EBrowserType, EBrowserName } from '@GBR/types'

import { Logger } from '@GBR/utils/logger'
import { exists, isEmpty } from '@keg-hub/jsutils'
import { defaultBrowser, browserMap } from '@GBR/constants'

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
