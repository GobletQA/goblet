import type { TBrowserConf, EBrowserName } from '../../types'

import { limbo } from '@keg-hub/jsutils'
import { Logger } from '@keg-hub/cli-utils'
import { ensureBrowserType } from '@GTasks/utils/helpers/ensureBrowserType'
import { startServer } from '@gobletqa/screencast/libs/playwright/server/startServer'
import { statusServer } from '@gobletqa/screencast/libs/playwright/server/statusServer'

/**
 * Starts the browser servers is they are not already running
 */
export const startServers = async (
  browsers:EBrowserName[],
  browserOpts:TBrowserConf
) => {
  const status = await statusServer()

  return Promise.all(
    browsers.map(async browser => {
      const type = ensureBrowserType(browser)
      const launchOpts = { ...browserOpts, type }

      const [err, server] = await limbo(startServer(launchOpts))
      if (!err) return server

      Logger.warn(`Could not start ${browser} browser server`)
      Logger.log(err.message)
    })
  )
}
