import type { TBrowserConf, EBrowserName } from '@GSC/types'

import playwright from 'playwright'
import { setServer } from './server'
import { noOpObj } from '@keg-hub/jsutils'
import metadata from '../helpers/metadata'
import { Logger } from '@GSC/utils/logger'
import { getBrowserOpts } from '../helpers/getBrowserOpts'

/**
 * Starts new browser server using the Playwright API
 * @function
 */
export const newServer = async (
  browser:EBrowserName,
  browserConf:TBrowserConf=noOpObj as TBrowserConf
) => {

  process.env.DEBUG && Logger.log(`Playwright Debug set to: ${process.env.DEBUG}`)
  Logger.info(`Starting playwright server ${browser}...`)

  // Launch the playwright server
  const launchOpts = getBrowserOpts(browserConf)
  Logger.info(`Creating Browser Server with launchOpts`, launchOpts)

  const pwServer = await playwright[browser].launchServer(launchOpts)

  Logger.info(`Configuring browser ${browser} websocket...`)
  const wsEndpoint = pwServer.wsEndpoint()

  Logger.empty()
  // Logger.info(`Browser Server websocket endpoint: ${wsEndpoint}`)
  Logger.info(`Browser Server websocket configured`)
  Logger.empty()

  // Save the playwright browser metadata to the <os-temp>/browser-meta.json, to be used for future connections
  await metadata.save(browser, wsEndpoint, browserConf)

  return setServer(browser, pwServer)
}
