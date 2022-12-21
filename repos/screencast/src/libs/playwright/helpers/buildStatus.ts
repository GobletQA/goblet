import type { EBrowserType, TBrowserStatus } from '@GSC/types'
import { capitalize } from '@keg-hub/jsutils'
import { browserStatus } from '@GSC/constants'
import { getBrowserType } from './getBrowserType'

/**
 * Builds the status message for the browser type
 */
export const buildStatus = (
  type:EBrowserType,
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
