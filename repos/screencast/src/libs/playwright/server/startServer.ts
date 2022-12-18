import type { TBrowserConf } from '@GSC/types'


import { getServer } from './server'
import { newServer } from './newServer'
import { noOpObj, wait } from '@keg-hub/jsutils'
import { checkServerPid } from './checkServerPid'
import { getBrowserType } from '../helpers/getBrowserType'


/**
 * Starts browser-server using playwright
 * See {@link https://playwright.dev/docs/api/class-browsertype#browser-type-launch-server|Playwright Docs} for more info
 */
export const startServer = async (
  browserConf:TBrowserConf = noOpObj as TBrowserConf,
) => {
  const server = getServer()
  if(server) return server
  
  const browser = getBrowserType(browserConf.type)
  const found = await checkServerPid(browser)

  return found
    ? getServer()
    : await newServer(browser, browserConf)
}
