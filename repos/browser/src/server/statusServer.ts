import type { EBrowserName, TBrowserProcs } from'@gobletqa/shared/types'

import { findProc } from './proc'
import { BrowserNames } from '@GBB/constants'
import { limbo } from '@keg-hub/jsutils/limbo'
import { exists } from '@keg-hub/jsutils/exists'

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
