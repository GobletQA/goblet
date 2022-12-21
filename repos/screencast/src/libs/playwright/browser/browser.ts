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
import { getBrowserOpts } from '../helpers/getBrowserOpts'
import { toBool, noOpObj, isFunc } from '@keg-hub/jsutils'
import { getBrowserType } from '../helpers/getBrowserType'
import { getContextOpts } from '../helpers/getContextOpts'
import { inDocker } from '@keg-hub/jsutils/src/node/inDocker'
import { getServerEndpoint } from '../server/getServerEndpoint'

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
  PW_BROWSERS[bType] = { browser }

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

  Logger.info(`- Launching Browser ${type}...`)
  const browser = await playwright[type].launch(getBrowserOpts(browserConf))
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

  const page = pages.length
    ? pages[0]
    : await context.newPage()
  
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

  const context = contexts.length
    ? contexts[0]
    : await browser.newContext(getContextOpts(browserConf.context))

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
      Logger.info(`Found existing browser`)
      return { browser: pwBrowser } as TPWBrowser
    }

    // Hack due to multiple calls on frontend startup
    // If more then one calls, and the browser is not create
    // then it will create two browsers
    // So this re-calls the same method when creatingBrowser is set
    // To allow consecutive calls on start up
    if(getBrowser.creatingBrowser)
      return new Promise((res, rej) => {
        setTimeout(() => res(getBrowser(browserConf, browserServer)), 250)
      })

    getBrowser.creatingBrowser = true

      // If the websocket is active, then start a websocket browser
    const builtBrowser = fromWebsocket(browserConf, browserServer)
      ? await createWSBrowser(type)
      : await createBrowser(browserConf, type)

    getBrowser.creatingBrowser = false
    return builtBrowser

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
  browserConf:TBrowserConf = noOpObj as TBrowserConf
) => {

  const pwComponents = await getPage(browserConf)

  // Build the status object for the newly started browser
  const status = buildStatus(
    browserConf.type,
    Boolean(pwComponents.browser && pwComponents.context && pwComponents.page),
  )

  return { status, ...pwComponents } as TPWComponents
}
