import type { TPageOpts } from '@GSC/types'

import { noOpObj, deepMerge } from '@keg-hub/jsutils'
import { checkVncEnv } from '../../utils/vncActiveEnv'
import { getGobletConfig } from '@gobletqa/shared/utils/getGobletConfig'

/**
 * Default options for a browser context
 * @type {Object}
 */
const options = {
  vnc: {},
  host: {},
}

/**
 * Builds the config for a Playwright browser page
 */
export const getPageOpts = (pageConf:TPageOpts = noOpObj as TPageOpts) => {
  const goblet = getGobletConfig()

  return deepMerge<TPageOpts>(
    goblet?.screencast?.page,
    checkVncEnv().vncActive ? options.vnc : options.host,
    pageConf
  )
}
