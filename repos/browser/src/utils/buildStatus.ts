import type { EBrowserName, EBrowserType, TBrowserStatus } from '@gobletqa/shared/types'

import { browserStatus } from '@gobletqa/environment/constants'
import { getBrowserType } from './getBrowserType'
import { capitalize } from '@keg-hub/jsutils/capitalize'

/**
 * Builds the status message for the browser type
 */
export const buildStatus = (
  type:EBrowserType|EBrowserName,
  status?:string | boolean,
  message?:string
) => {
  const name = capitalize(getBrowserType(type))
  return {
    status: status,
    message: message || `${name} Browser is ${status}`,
    running: status === browserStatus.running || status === true,
  } as TBrowserStatus
}
