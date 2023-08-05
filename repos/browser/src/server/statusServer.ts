import type { EBrowserName, TBrowserProcs } from '@GBR/types'

import { findProc } from './proc'
import { BrowserNames } from '@GBR/constants'
import { limbo, exists } from '@keg-hub/jsutils'

/**
 * Gets the current running status of browser server the process
 */
export const statusServer = async (browser?:string):Promise<TBrowserProcs> => {
  const hasBrowser = exists(browser)
  if (hasBrowser && !BrowserNames.includes(browser as EBrowserName))
    throw new Error(
      `Can not get browser status, invalid browser type. Must be one of:\n\t${BrowserNames.join(
        ', '
      )}`
    )

  return await BrowserNames.reduce(async (resp:Record<any, any>, type:string) => {
    const acc = await resp

    if (exists(browser) && browser !== type) return acc
    // chromium runs as a chrome process name, so use that instead
    const [err, status] = await limbo(
      findProc(type === 'chromium' ? `chrome` : type)
    )

    return err ? acc : { ...acc, [type]: status }
  }, Promise.resolve({} as TBrowserProcs))
}
