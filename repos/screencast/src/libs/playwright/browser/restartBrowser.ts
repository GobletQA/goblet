import type { TBrowserConf } from '@GSC/types'

import { stopBrowser } from './stopBrowser'
import { startBrowser } from './startBrowser'

/**
 * Helper method to stop the currently running browser, and start a new one
 * @function
 * @public
 */
export const restartBrowser = async (browserConf:TBrowserConf) => {
  await stopBrowser(browserConf)
  return await startBrowser(browserConf)
}

