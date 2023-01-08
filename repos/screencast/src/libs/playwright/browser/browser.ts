import type {
  TBrowser,
  TPWBrowser,
  TBrowserConf,
  EBrowserType,
  EBrowserName,
  TPWComponents,
} from '@GSC/types'

import playwright from 'playwright'
import { Logger } from '@GSC/utils/logger'
import { defaultBrowser } from '@GSC/constants'
import { buildStatus } from '../helpers/buildStatus'
import { checkVncEnv } from '../../utils/vncActiveEnv'
import { toBool, noOpObj, isFunc } from '@keg-hub/jsutils'
import { getBrowserOpts } from '../helpers/getBrowserOpts'
import { getBrowserType } from '../helpers/getBrowserType'
import { getContextOpts } from '../helpers/getContextOpts'
import { inDocker } from '@keg-hub/jsutils/src/node/inDocker'
import { buildBrowserConf } from '../helpers/buildBrowserConf'
import { getServerEndpoint } from '../server/getServerEndpoint'
import { checkInternalPWContext } from './checkInternalPWContext'

/**
 * Cache holder for all launched playwright browsers by type
 * @type {Object|undefined}
 */
let PW_BROWSERS = {} as Record<EBrowserName, TBrowser>


/**
 * Sets the cached playwright server
 */
const setBrowser = (
  browser:TBrowser,
  type:EBrowserName = defaultBrowser
) => {

  const bType = type || browser.browserType().name() || defaultBrowser

  // Set the new browser
  PW_BROWSERS[bType] = browser

  // // Add listener to delete the browser when closed
  browser &&
    isFunc(browser.on) &&
    browser.on('disconnected', async () => {
      if (!PW_BROWSERS[type]) return

      PW_BROWSERS[type] = undefined
      delete PW_BROWSERS[type]
    })

  return PW_BROWSERS
}


/**
 * Checks if the Browser should be created from a Websocket and the running browser server
 */
const fromWebsocket = (
  browserConf:TBrowserConf = noOpObj as TBrowserConf,
  browserServer?:boolean
):boolean => {
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
const createWSBrowser = async (type:EBrowserName):Promise<TPWBrowser> => {
  const endpoint = await getServerEndpoint(type)

  // Check if the websocket is active
  // If so, then update the endpoint url to target the host machine
  const browserEndpoint =
    inDocker() && checkVncEnv().socketActive
      ? endpoint.replace('127.0.0.1', 'host.docker.internal')
      : endpoint

  const browser = await playwright[type].connect(browserEndpoint)
  Logger.info(`createWSBrowser - Browser ${type} was started from server websocket ${browserEndpoint}`)

  setBrowser(browser, type)

  return { browser } as TPWBrowser
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

  const browser = await playwright[type].launch(getBrowserOpts(browserConf))
  Logger.info(`createBrowser - Browser ${type} was started`)
  setBrowser(browser, type)

  return { browser } as TPWBrowser
}

/**
 * Returns the cached playwright page
 * @function
 */
export const getPage = async (
  browserConf:TBrowserConf
) => {

  const { context, browser } = await getContext(browserConf)
  const pages = context.pages()
  
  Logger.verbose(`getPage - Found ${pages.length} pages open on the context`)
  const hasPages = Boolean(pages.length)
  const hasMultiplePages = pages.length > 1

  if(hasMultiplePages){
    Logger.verbose(`getPage - Closing extra pages on the context`)
    await Promise.all(pages.map(async (page, idx) => idx && await page.close()))
  }

  const page = hasPages ? pages[0] : await context.newPage()

  hasPages
    ? Logger.verbose(`getPage - Found page on context for browser ${browserConf.type}`)
    : Logger.verbose(`getPage - New page created on context for browser ${browserConf.type}`)

  return { context, browser, page } as TPWComponents
}


/**
 * Returns the cached Playwright context
 * @function
 */
export const getContext = async (
  browserConf:TBrowserConf
) => {

  const { browser } = await getBrowser(browserConf)
  const contexts = browser.contexts()
  const hasContexts = Boolean(contexts.length)
  const hasMultipleContexts = contexts.length > 1

  if(hasMultipleContexts){
    Logger.verbose(`getContext - Closing extra contexts on the browser`)
    await Promise.all(contexts.map(async (context, idx) => idx && await context.close()))
  }

  const context = hasContexts ? contexts[0] : await browser.newContext(getContextOpts(browserConf.context))

  hasContexts
    ? Logger.verbose(`getContext - Found existing context on browser ${browserConf.type}`)
    : Logger.verbose(`getContext - New context created for browser ${browserConf.type}`)

  return { context, browser }
}


/**
 * Closes a browser, and removes it from the PW_BROWSERS object
 */
export const closeBrowser = async (type?:EBrowserType) => {
  const browserType = getBrowserType(type)
  const browser = PW_BROWSERS[browserType]

  try {
    browser && await browser?.close()
  }
  catch (err) {
    Logger.warn(err.stack)
  }

  return PW_BROWSERS
}

/**
 * Gets an existing browser, or starts a new one using the Playwright API
 */
export const getBrowser = async (
  browserConf:TBrowserConf = noOpObj as TBrowserConf,
  browserServer?:boolean
):Promise<TPWBrowser> => {
  try {

    const type = getBrowserType(browserConf.type as EBrowserType)
    const pwBrowser = PW_BROWSERS[type]

    if (pwBrowser) {
      Logger.verbose(`getBrowser - Using existing browser ${type}`)
      return { browser: pwBrowser } as TPWBrowser
    }

    // Hack due to multiple calls on frontend startup
    // If more then one calls, and the browser is not create
    // then it will create two browsers
    // So this re-calls the same method when creatingBrowser is set
    // To allow consecutive calls on start up
    if(getBrowser.creatingBrowser)
      return new Promise((res, rej) => {
        Logger.verbose(`getBrowser - Browser ${type} is creating, try agin in 100ms`)
        setTimeout(() => res(getBrowser(browserConf, browserServer)), 100)
      })

    getBrowser.creatingBrowser = true
      // If the websocket is active, then start a websocket browser
    const fromWs = fromWebsocket(browserConf, browserServer)

    const browserResp = fromWs
      ? await createWSBrowser(type)
      : await createBrowser(browserConf, type)

    fromWs
      ? Logger.verbose(`getBrowser - New Websocket Browser ${type} created`)
      : Logger.verbose(`getBrowser - New Standalone Browser ${type} created`)

    getBrowser.creatingBrowser = false
    return browserResp

  }
  catch(err){
    // Ensure creatingBrowser gets set to false
    getBrowser.creatingBrowser = false
    throw err
  }
}

getBrowser.creatingBrowser = false


/**
 * Starts browser using playwright
 * See {@link https://playwright.dev/docs/api/class-browsertype#browser-type-launch|Playwright Docs} for more info
 * @function
 * @public
 */
export const startBrowser = async (
  config:TBrowserConf = noOpObj as TBrowserConf
):Promise<TPWComponents> => {

  try {
    const browserConf = buildBrowserConf(config)
    const type = getBrowserType(browserConf.type as EBrowserType)

    let pwComponents = checkInternalPWContext(type)
  
    if(!pwComponents){
      Logger.info(`startBrowser - Getting browser type ${type}`)

      const pwBrowser = PW_BROWSERS[type]

      // Hack due to multiple calls on frontend startup
      // If more then one calls, and the browser is not create
      // then it will create two browsers
      // So this re-calls the same method when creatingBrowser is set
      // To allow consecutive calls on start up
      if(!pwBrowser && startBrowser.creatingBrowser)
        return new Promise((res, rej) => {
          Logger.info(`startBrowser - Browser ${type} is creating, try agin in 100ms`)
          setTimeout(() => res(startBrowser(browserConf)), 100)
        })


      startBrowser.creatingBrowser = true
      pwComponents = await getPage(browserConf)
      startBrowser.creatingBrowser = false

      Logger.info(`startBrowser - Browser ${type} and child components found`)
    }
    // else Logger.verbose(`startBrowser - Found playwright components from internal reference`)

    // Build the status object for the newly started browser
    const status = buildStatus(
      browserConf.type,
      Boolean(
        pwComponents.browser
          && pwComponents.context
          && pwComponents.page
      ),
    )

    return { status, ...pwComponents } as TPWComponents
  }
  catch(err){
    startBrowser.creatingBrowser = false
    throw err
  }

}

startBrowser.creatingBrowser = false
