import type { EBrowserName, EBrowserType, TBrowserConf } from '@GBB/types'
import type playwright from 'playwright'

import { getServer } from './server'
import { newServer } from './newServer'
import { checkServerPid } from './checkServerPid'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { getBrowserType } from '@GBB/utils/getBrowserType'

/**
 * Starts browser-server using playwright
 * See {@link https://playwright.dev/docs/api/class-browsertype#browser-type-launch-server|Playwright Docs} for more info
 */
export const startServer = async (
  browserConf:TBrowserConf = noOpObj as TBrowserConf,
  type?: EBrowserType|EBrowserName
) => {
  const browserType = getBrowserType(type || browserConf.type)
  const server = getServer(browserType)

  if(server) return server
  
  const found = await checkServerPid(browserType)

  return found
    ? getServer(browserType)
    : await newServer(browserType, browserConf)
}
