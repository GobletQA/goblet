import type { TBrowserType } from '@GSC/types'
import { capitalize } from '@keg-hub/jsutils'
import { browserStatus } from '@GSC/constants'
import { getBrowserType } from './getBrowserType'

/**
 * Builds the status message for the browser type
 */
export const buildStatus = (
  type:TBrowserType,
  status?:string | boolean,
  message?:string
) => {
  const name = capitalize(getBrowserType(type))
  return {
    status: status,
    message: message || `${name} Browser is ${status}`,
    running: status === browserStatus.running || status === true,
  }
}
