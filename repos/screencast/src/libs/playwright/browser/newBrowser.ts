import type { TBrowserConf } from '@GSC/types'

import playwright from 'playwright'
import { noOpObj } from '@keg-hub/jsutils'
import { Logger } from '@GSC/utils/logger'
import { getServer } from '../server/server'
import { inDocker } from '@keg-hub/cli-utils'
import { getBrowser, setBrowser } from './browser'
import { startServer } from '../server/startServer'
import { checkVncEnv } from '../../utils/vncActiveEnv'
import { getBrowserOpts } from '../helpers/getBrowserOpts'
import { getBrowserType } from '../helpers/getBrowserType'

/**
 * Starts new browser by connecting to an existing browser server websocket
 * @function
 */
export const newBrowserWS = async (
  browserConf:TBrowserConf
) => {

  try {

    const type = getBrowserType(browserConf.type)
    const pwBrowser = getBrowser(type)
    if (pwBrowser) {
      Logger.info(`- Found existing running Browser`)
      return { browser: pwBrowser }
    }

    // Hack due to multiple calls on frontend startup
    // If more then one calls, and the browser is not create
    // then it will create two browsers
    // So this re-calls the same method when creatingBrowser is set
    // To allow consecutive calls on start up
    if(newBrowserWS.creatingBrowser){
      Logger.info(`- Already starting browser server, calling newBrowserWS method in 500ms...`)
      return new Promise((res, rej) => {
        setTimeout(() => res(newBrowserWS(browserConf)), 500)
      })
    }

    newBrowserWS.creatingBrowser = true

    let server = getServer()

    if (!server) {
      Logger.info(`- Browser server not found. Starting new server...`)
      server = await startServer({ ...browserConf, type })
    }

    Logger.info(`- Browser server found. Getting endpoint from meta-data...`)
    const endpoint = server.wsEndpoint()

    // Check if the websocket is active
    // If so, then update the endpoint url to target the host machine
    const browserEndpoint =
      inDocker() && checkVncEnv().socketActive
        ? endpoint.replace('127.0.0.1', 'host.docker.internal')
        : endpoint

    Logger.info(`- Creating new browser from browser server...`)
    const browser = await playwright[type].connect(browserEndpoint)

    setBrowser(browser, type)
    newBrowserWS.creatingBrowser = false
    
    return { browser }
  }
  catch(err){
    // Ensure creatingBrowser gets set to false
    newBrowserWS.creatingBrowser = false
    throw err
  }
}

newBrowserWS.creatingBrowser = false


/**
 * Starts new browser using the Playwright API
 */
export const newBrowser = async (
  browserConf:TBrowserConf = noOpObj as TBrowserConf,
  checkStatus?:boolean,
  browserServer?:boolean
) => {
  try {

    const { isKube, socketActive } = checkVncEnv()

    // If the websocket is active, then start a websocket browser
    if (browserServer || browserConf.ws || socketActive || isKube)
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

    Logger.info(`- Starting Regular Browser ${type}...`)
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
