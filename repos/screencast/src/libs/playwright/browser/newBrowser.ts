import type { TBrowserConf } from '@GSC/types'

import playwright from 'playwright'
import { noOpObj } from '@keg-hub/jsutils'
import { Logger } from '@GSC/utils/logger'
import { inDocker } from '@keg-hub/cli-utils'
import { getMetadata } from '../server/server'
import { getBrowser, setBrowser } from './browser'
import { startServer } from '../server/startServer'
import { checkVncEnv } from '../../utils/vncActiveEnv'
import { checkServerPid } from '../server/checkServerPid'
import { getBrowserOpts } from '../helpers/getBrowserOpts'
import { getBrowserType } from '../helpers/getBrowserType'



/**
 * Starts new browser by connecting to an existing browser server websocket
 * @function
 */
export const newBrowserWS = async (
  browserConf:TBrowserConf
) => {
  const type = getBrowserType(browserConf.type)
  const statusPid = await checkServerPid(type)

  if (!statusPid) {
    Logger.info(`- Browser server not found. Starting new server...`)
    await startServer({ ...browserConf, type })
  }

  const { endpoint } = await getMetadata(type) as Record<'endpoint', string>

  // Check if the websocket is active
  // If so, then update the endpoint url to target the host machine
  const browserEndpoint =
    inDocker() && checkVncEnv().socketActive
      ? endpoint.replace('127.0.0.1', 'host.docker.internal')
      : endpoint

  const browser = await playwright[type].connect(browserEndpoint)

  setBrowser(browser, type)
  return { browser }
}

/**
 * Starts new browser using the Playwright API
 */
export const newBrowser = async (
  browserConf:TBrowserConf = noOpObj as TBrowserConf,
  checkStatus?:boolean,
  browserServer?:boolean
) => {
  try {
    // If the websocket is active, then start a websocket browser
    if (browserServer || browserConf.ws || checkVncEnv().socketActive)
      return await newBrowserWS(browserConf)

    const type = getBrowserType(browserConf.type)

    const pwBrowser = getBrowser(type)
    if (pwBrowser) {
      Logger.info(`- Found already running Browser`)
      return { browser: pwBrowser }
    }

    // Hack due to multiple calls on frontend startup
    // If more then one calls, and the browser is not create
    // then it will create two browsers
    // So this re-calls the same method when creatingBrowser is set
    // To allow consecutive calls on start up
    if(newBrowser.creatingBrowser)
      return new Promise((res, rej) => {
        setTimeout(() => res(newBrowser(browserConf, checkStatus)), 500)
      })

    newBrowser.creatingBrowser = true

    Logger.info(`- Starting Browser ${type}...`)
    const browser = await playwright[type].launch(getBrowserOpts(browserConf))
    setBrowser(browser, type)

    newBrowser.creatingBrowser = false

    return { browser }
  }
  catch(err){
    // Ensure creatingBrowser gets set to false
    newBrowser.creatingBrowser = false
    throw err
  }
}

newBrowser.creatingBrowser = false
