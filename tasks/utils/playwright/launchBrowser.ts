#!/usr/bin/env node

import type { TBrowserType, TBrowserConf, TBrowserMetaDataContext } from '../../types'

/**
 * Script should be run on the HOST machine, NOT with in the docker container
 * Starts the playwright chromium server on the HOST machine,
 * The `endpoint` is then passed to the docker container as an ENV - BROWSER_WS_ENDPOINT
 */
import { Logger, inDocker } from '@keg-hub/cli-utils'
import { noOpObj, exists, isEmpty, limbo } from '@keg-hub/jsutils'
import metadata from '@gobletqa/screencast/libs/playwright/helpers/metadata'
import { newBrowser } from '@gobletqa/screencast/libs/playwright/browser/newBrowser'
import { startServer } from '@gobletqa/screencast/libs/playwright/server/startServer'
import { getBrowserType } from '@gobletqa/screencast/libs/playwright/helpers/getBrowserType'
import { getServerEndpoint } from '@gobletqa/screencast/libs/playwright/server/getServerEndpoint'

type TLaunchBrowserConf = TBrowserConf & {
  log?:boolean
  allowed?:TBrowserType[]
}

/**
 * Logs a highlighted message
 * @param {string} start - Start of message
 * @param {string} middle - Part of message highlighted
 * @param {string} end - End of message
 * @param {boolean} [log] - Should the message be logged
 *
 */
const logHighlight = (
  start:string,
  middle:string,
  end:string,
  log:boolean=true
) => {
  log && Logger.highlight(`\n==== ${start}`, middle, `${end} ====`)
}

/**
 * Gets the browser name for logs
 * Adds headless to the browser type if it's true
 */
const getBrowserName = (headless:boolean, type:string) =>
  `${headless ? 'headless ' : ''}${type}`

/**
 * Checks if inside a docker container, and it so, throws an error
 * @throws
 */
const inDockerErr = (endpoint:string) => {
  if (!inDocker()) return

  endpoint = endpoint.replace('127.0.0.1', 'host.docker.internal')
  throw new Error(`Could not connect to the browser at ${endpoint}. Exiting...`)
}

/**
 * Check to see if the previous launch parameters match the current ones
 */
const checkLaunchParams = (
  browserType:TBrowserType,
  browserConf:TBrowserConf,
  browserMeta:TBrowserMetaDataContext,
) => {
  return (
    !isEmpty(browserMeta.endpoint)
      && browserType === browserMeta.type
      && browserConf.headless === browserMeta.browserConf.headless
      && browserConf.slowMo === browserMeta.browserConf.slowMo
  )
}

/**
 * If launch params match, then just try connecting to that launched
 * browser. If you can connect, close the connection and do nothing else.
 */
const testBrowserConnection = async (
  browserType:TBrowserType,
  browserConf:TBrowserConf,
  paramsMatch:boolean
) => {
  if (!paramsMatch) return

  const [err, browser] = await limbo(
    newBrowser({ type: browserType, ...browserConf }, true)
  )

  if (!err && browser.isConnected()) {
    browser.close()
    return true
  }
}

/**
 * Launches the browser server instance of the browserType and launch options
 * @returns {Object} - Browser server instance
 */
const launchBrowserServer = async (
  browserType:string,
  browserConf:TBrowserConf,
  log:boolean
) => {
  const browserMeta = await metadata.read(browserType)
  const paramsMatch = checkLaunchParams(browserType, browserConf, browserMeta)
  const canConnect = await testBrowserConnection(
    browserType,
    browserConf,
    paramsMatch,
  )
  const name = getBrowserName(browserConf.headless, browserType)

  if (canConnect)
    return logHighlight(`Using previously-launched`, name, `on host machine...`, log)

  // If we can't connect, and we're inside docker, throw an error
  inDockerErr(browserMeta.endpoint)

  // Otherwise, try to launch the browser.
  logHighlight(`Starting`, name, `on host machine..`, log)

  return startServer(browserConf, browserType)
}

/**
 * Starts a Playwright Browser Server.
 * <br/> Then gets the websocket endpoint for the server,
 * <br/> For a list of all options, [Go here](https://playwright.dev/docs/api/class-browsertype/#browsertypelaunchoptions)
 * @function
 * @export
 */
export const launchBrowser = async (
  config:TLaunchBrowserConf = noOpObj as TLaunchBrowserConf
) => {
  const {
    log = true,
    allowed = ['chromium', 'firefox', 'webkit'],
    ...params
  } = config

  const browserConf = {
    headless: exists(config.headless) ? config.headless : true,
    ...params,
  } as TBrowserConf

  const browserType = getBrowserType(params.type)
  const browserServer = await launchBrowserServer(
    browserType,
    browserConf,
    log
  )

  if (!browserServer)
    return Logger.error(`${browserType} Browser Server could not be launched.`, browserConf)

  const endpoint = await getServerEndpoint(browserType)

  if (!endpoint)
    throw new Error(
      `Could not get the websocket endpoint from the ${browserType} browser server!`
    )

  return endpoint
}
