import type { TBrowserConf } from '@GSC/types'

import playwright from 'playwright'
import { noOpObj } from '@keg-hub/jsutils'
import { getMetadata } from '../server/server'
import { getBrowser, setBrowser } from './browser'
import { startServer } from '../server/startServer'
import { statusServer } from '../server/statusServer'
import { Logger, inDocker } from '@keg-hub/cli-utils'
import { checkVncEnv } from '../../utils/vncActiveEnv'
import { getBrowserOpts } from '../helpers/getBrowserOpts'
import { getBrowserType } from '../helpers/getBrowserType'

/**
 * Checks for the pid of an already running browser
 */
const getBrowserPid = async (type:string, checkStatus:boolean) => {
  // If no status check, return true which is the same as having a pid for the browser
  if (!checkStatus) return true

  const allStatus = await statusServer(type)
  const status = allStatus && allStatus[type]

  return status & status.pid
}

/**
 * Starts new browser by connecting to an existing browser server websocket
 * @function
 */
export const newBrowserWS = async (
  browserConf:TBrowserConf,
  checkStatus:boolean = true
) => {
  const type = getBrowserType(browserConf.type)
  const statusPid = await getBrowserPid(type, checkStatus)

  if (!statusPid) {
    Logger.log(`- Browser server not found. Starting new server...`)
    await startServer({ ...browserConf, type })
  }

  const { endpoint } = await getMetadata(type) as Record<'endpoint', string>

  // Check if the websocket is active
  // If so, then update the endpoint url to target the host machine
  const browserEndpoint =
    inDocker() && checkVncEnv().socketActive
      ? endpoint.replace('127.0.0.1', 'host.docker.internal')
      : endpoint

  const browser = await playwright[type].connect({
    wsEndpoint: browserEndpoint,
  })

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
    if (checkVncEnv().socketActive || browserServer)
      return await newBrowserWS(browserConf, checkStatus)

    const type = getBrowserType(browserConf.type)

    const pwBrowser = getBrowser(type)
    if (pwBrowser) {
      Logger.stdout(`- Found already running Browser\n`)
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

    Logger.stdout(`- Starting Browser ${type}...\n`)
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
