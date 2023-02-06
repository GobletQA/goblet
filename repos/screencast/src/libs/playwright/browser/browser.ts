import type {
  TBrowser,
  TPWBrowser,
  TBrowserPage,
  TBrowserConf,
  EBrowserType,
  EBrowserName,
  TPWComponents,
} from '@GSC/types'

import playwright from 'playwright'
import { Automate } from '../automate'
import { Logger } from '@GSC/utils/logger'
import { deepMerge } from '@keg-hub/jsutils'
import { EmptyBrowser } from './emptyBrowser'
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
import { GobletQAUrl, defaultBrowser, CreateBrowserRetry } from '@GSC/constants'
import { getDefaultGobletConfig } from '@gobletqa/shared/goblet/getDefaultGobletConfig'

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
 * Creates a browser and context together
 * The context is always the same, and saves data
 */
const createPersistentBrowser = async (
  browserConf:TBrowserConf = noOpObj as TBrowserConf,
  type:EBrowserName
) => {

  const opts = deepMerge(
    getBrowserOpts(browserConf),
    getContextOpts(browserConf.context)
  )
  Logger.verbose(`Browser-PersistentContext options`, opts)
  
  const { internalPaths } = getDefaultGobletConfig()
  const context = await playwright[type].launchPersistentContext(
    internalPaths.userDataTempDir,
    opts
  )

  const browser = new EmptyBrowser(context, type)
  Logger.info(`createPersistentBrowser - Browser ${type} was started`)
  setBrowser(browser, type)

  return { browser, context } as TPWBrowser
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

  const opts = getBrowserOpts(browserConf)
  const browser = await playwright[type].launch(opts)
  Logger.info(`createBrowser - Browser ${type} was started`)
  setBrowser(browser, type)

  return { browser } as TPWBrowser
}

/**
 * Returns the cached playwright page
 * Only used by testUtils
 *
 * @deprecated - Will be removed once testUtils is updated, use getBrowser instead
 * @DEPRECATED - Will be removed once testUtils is updated, use getBrowser instead
 *
 * @function
 */
export const getPage = async (
  browserConf:TBrowserConf
):Promise<TPWComponents> => {
  try {
    const { context, browser } = await getContext(browserConf)
    const pages = context.pages()
    
    Logger.verbose(`getPage - Found ${pages.length} pages open on the context`)
    const hasPages = Boolean(pages.length)
    const hasMultiplePages = pages.length > 1

    if(hasMultiplePages){
      Logger.verbose(`getPage - Closing extra pages on the context`)
      await Promise.all(pages.map(async (page, idx) => idx && await page.close()))
    }

    // Hack due to multiple calls on frontend startup
    // If more then one calls, and the browser is not create
    // then it will create two browsers
    // So this re-calls the same method when creatingBrowser is set
    // To allow consecutive calls on start up
    if(!hasPages && getPage.creatingPage)
      return new Promise((res, rej) => {
        Logger.info(`getPage - Browser Page is creating, try agin in ${CreateBrowserRetry}ms`)
        setTimeout(() => res(getPage(browserConf)), CreateBrowserRetry)
      })

    let page:TBrowserPage
    getPage.creatingPage = true
    if(hasPages) page = pages[0]
    else {
      page = await context.newPage()
      try {
        await page.goto(GobletQAUrl)
      }
      catch(err){
        console.error(err)
      }
    }

    getPage.creatingPage = false

    hasPages
      ? Logger.verbose(`getPage - Found page on context for browser ${browserConf.type}`)
      : Logger.verbose(`getPage - New page created on context for browser ${browserConf.type}`)

    return { context, browser, page } as TPWComponents
  }
  catch(err){
    getPage.creatingPage = false
    throw err
  }
}
getPage.creatingPage = false

/**
 * Returns the cached Playwright context
 * Only used by testUtils
 *
 * @deprecated - Will be removed once testUtils is updated, use getBrowser instead
 * @DEPRECATED - Will be removed once testUtils is updated, use getBrowser instead
 *
 * @function
 */
export const getContext = async (
  browserConf:TBrowserConf
) => {

  const resp = await getBrowser(browserConf)

  let context = resp.context
  const browser = resp.browser
  
  if(!context){
    const contexts = browser.contexts()
    const hasContexts = Boolean(contexts.length)
    const hasMultipleContexts = contexts.length > 1

    if(hasMultipleContexts){
      Logger.verbose(`getContext - Closing extra contexts on the browser`)
      await Promise.all(contexts.map(async (context, idx) => idx && await context.close()))
    }

    const opts = getContextOpts(browserConf.context)
    Logger.verbose(`Context Options`, opts)

    if(hasContexts){
      context = contexts[0]
      Logger.verbose(`getContext - Found existing context on browser ${browserConf.type}`)
    }
    else {
      context = await browser.newContext(opts)
      Logger.verbose(`getContext - New context created for browser ${browserConf.type}`)

      Automate.bind({ parent: context })
    }

  }
  else Logger.verbose(`getContext - Found Persistent context for browser ${browserConf.type}`)


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
 * @function
 */
const getBrowser = async (
  browserConf:TBrowserConf = noOpObj as TBrowserConf,
  browserServer?:boolean,
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
        Logger.verbose(`getBrowser - Browser ${type} is creating, try agin in ${CreateBrowserRetry}ms`)
        setTimeout(() => res(getBrowser(browserConf, browserServer)), CreateBrowserRetry)
      })

    getBrowser.creatingBrowser = true

    /** ------------------------------------

     * TODO: - At some point will need to rework this to figure out the best option
     * Need to setup params to toggle the browser type
     * Will need to enable the browser server running via supervisor

      // If the websocket is active, then start a websocket browser
      const fromWs = fromWebsocket(browserConf, browserServer)
      const browserResp = fromWs
        ? await createWSBrowser(type)
        : await createBrowser(browserConf, type)
      fromWs
        ? Logger.verbose(`getBrowser - New Websocket Browser ${type} created`)
        : Logger.verbose(`getBrowser - New Standalone Browser ${type} created`)

    
      await createWSBrowser(type)
      Logger.verbose(`getBrowser - New Websocket Browser ${type} created`)

      const browserResp = await createPersistentBrowser(browserConf, type)
      Logger.verbose(`getBrowser - New Persistent Context Browser ${type} created`)

    ------------------------------------ */


    // Default to creating a standalone browser
    // Should be faster then going over a websocket
    const browserResp = await createBrowser(browserConf, type)
    Logger.verbose(`getBrowser - New Standalone Browser ${type} created`)

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
  config:TBrowserConf = noOpObj as TBrowserConf,
  browserOnly?:boolean,
  browserServer?:boolean,
):Promise<TPWComponents> => {

  if(browserOnly){
    const browserConf = buildBrowserConf(config)
    const resp = await getBrowser(browserConf, browserServer)

    return resp as TPWComponents
  }

  try {
    const browserConf = buildBrowserConf(config)
    const type = getBrowserType(browserConf.type as EBrowserType)

    let pwComponents = checkInternalPWContext(type)
    if(pwComponents?.browser) setBrowser(pwComponents.browser, type)

    if(!pwComponents?.page){
      Logger.info(`startBrowser - Getting browser type ${type}`)

      const pwBrowser = PW_BROWSERS[type]

      // Hack due to multiple calls on frontend startup
      // If more then one calls, and the browser is not create
      // then it will create two browsers
      // So this re-calls the same method when creatingBrowser is set
      // To allow consecutive calls on start up
      if(!pwBrowser && startBrowser.creatingBrowser)
        return new Promise((res, rej) => {
          Logger.info(`startBrowser - Browser ${type} is creating, try agin in ${CreateBrowserRetry}ms`)
          setTimeout(() => res(startBrowser(browserConf)), CreateBrowserRetry)
        })


      startBrowser.creatingBrowser = true
      pwComponents = await getPage(browserConf)
      startBrowser.creatingBrowser = false

      Logger.info(`startBrowser - Browser ${type} and child components found`)
    }
    // else Logger.verbose(`startBrowser - Found playwright components from internal reference`)

    const hasComponents = Boolean(
      pwComponents.browser
        && pwComponents.context
        && pwComponents.page
    )

    // Build the status object for the newly started browser
    const status = buildStatus(browserConf.type, hasComponents)

    return {
      status,
      ...pwComponents
    } as TPWComponents
  }
  catch(err){
    getPage.creatingPage = false
    startBrowser.creatingBrowser = false
    throw err
  }

}

startBrowser.creatingBrowser = false
