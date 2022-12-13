import type { TBrowserProcs } from '@GSC/types'

import { browserNames } from '@GSC/constants'
import { findProc } from '../../proc/findProc'
import { limbo, exists } from '@keg-hub/jsutils'

/**
 * Gets the current running status of browser server the process
 */
export const statusServer = async (browser?:string):Promise<TBrowserProcs> => {
  const hasBrowser = exists(browser)
  if (hasBrowser && !browserNames.includes(browser))
    throw new Error(
      `Can not get browser status, invalid browser type. Must be one of:\n\t${browserNames.join(
        ', '
      )}`
    )

  return await browserNames.reduce(async (resp:Record<any, any>, type:string) => {
    const acc = await resp

    if (exists(browser) && browser !== type) return acc
    // chromium runs as a chrome process name, so use that instead
    const [err, status] = await limbo(
      findProc(type === 'chromium' ? `chrome` : type)
    )

    return err ? acc : { ...acc, [type]: status }
  }, Promise.resolve({} as TBrowserProcs))
}
