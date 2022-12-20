import type { EBrowserType, EBrowserName, TBrowserConf } from '@GSC/types'

import playwright from 'playwright'
import { Logger } from '@GSC/utils/logger'
import { getBrowser, setBrowser } from './browser'
import { toBool, noOpObj } from '@keg-hub/jsutils'
import { checkVncEnv } from '../../utils/vncActiveEnv'
import { getBrowserOpts } from '../helpers/getBrowserOpts'
import { getBrowserType } from '../helpers/getBrowserType'
import { inDocker } from '@keg-hub/jsutils/src/node/inDocker'
import { getServerEndpoint } from '../server/getServerEndpoint'


/**
 * Checks if the Browser should be created from a Websocket and the running browser server
 */
const fromWebsocket = (
  browserConf:TBrowserConf = noOpObj as TBrowserConf,
  browserServer?:boolean
) => {
  const { isKube, socketActive } = checkVncEnv()

  return !toBool(process.env.GOBLET_RUN_FROM_CI)
    && (
      browserServer
        || browserConf?.ws
        || socketActive
        || isKube
    )
}

/**
 * Starts new browser by connecting to an existing browser server websocket
 * @function
 */
const createWSBrowser = async (type:EBrowserName) => {

  Logger.info(`Getting endpoint from server...`)
  const endpoint = await getServerEndpoint(type)

  // Check if the websocket is active
  // If so, then update the endpoint url to target the host machine
  const browserEndpoint =
    inDocker() && checkVncEnv().socketActive
      ? endpoint.replace('127.0.0.1', 'host.docker.internal')
      : endpoint

  Logger.info(`- Creating browser ${type} from server...`)
  const browser = await playwright[type].connect(browserEndpoint)

  setBrowser(browser, type)

  return { browser }
}

/**
 * Creates a regular browser NOT connected to a browser server over websocket
 * Should only really be run in CI environments
 * All other cases should use the browser-server websocket
 */
const createBrowser = async (
  browserConf:TBrowserConf = noOpObj as TBrowserConf,
  type:EBrowserName
) => {

  Logger.info(`- Launching Browser ${type}...`)
  const browser = await playwright[type].launch(getBrowserOpts(browserConf))
  setBrowser(browser, type)

  return { browser }
}


/**
 * Starts new browser using the Playwright API
 */
export const newBrowser = async (
  browserConf:TBrowserConf = noOpObj as TBrowserConf,
  browserServer?:boolean
) => {
  try {

    const type = getBrowserType(browserConf.type as EBrowserType)
    const pwBrowser = getBrowser(type)

    if (pwBrowser) {
      Logger.info(`Found existing browser`)
      return { browser: pwBrowser }
    }

    // Hack due to multiple calls on frontend startup
    // If more then one calls, and the browser is not create
    // then it will create two browsers
    // So this re-calls the same method when creatingBrowser is set
    // To allow consecutive calls on start up
    if(newBrowser.creatingBrowser)
      return new Promise((res, rej) => {
        setTimeout(() => res(newBrowser(browserConf, browserServer)), 250)
      })

    newBrowser.creatingBrowser = true

      // If the websocket is active, then start a websocket browser
    const builtBrowser = fromWebsocket(browserConf, browserServer)
      ? await createWSBrowser(type)
      : await createBrowser(browserConf, type)

    newBrowser.creatingBrowser = false
    return builtBrowser

  }
  catch(err){
    // Ensure creatingBrowser gets set to false
    newBrowser.creatingBrowser = false
    throw err
  }
}

newBrowser.creatingBrowser = false