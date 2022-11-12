import type { TBrowserConf } from '@GSC/types'

import {noOpObj } from '@keg-hub/jsutils'
import { startBrowser } from './startBrowser'

export const statusBrowser = async (browserConf:TBrowserConf = noOpObj as TBrowserConf) => {
  return await startBrowser(browserConf)
}
