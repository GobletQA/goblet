import type {
  TStepCtx,
  TBrowser,
  EBrowserName,
  TBrowserPage,
  TPWComponents,
  TBrowserContext,
  TBrowserContextOpts,
  TContextStorageState,
} from '@GTU/Types'

import os from 'os'
import path from 'path'
import { startTracing } from './tracing'
import { get, emptyObj } from '@keg-hub/jsutils'
import { getPWComponents } from '@gobletqa/screencast/libs/playwright/browser/browser'

// import {
//   ghostMouse,
//   getPWComponents,
//   setBrowserDefaults,
// } from '@gobletqa/screencast/libs/playwright'

import {
  browserCookieLoc,
  setContextCookie,
  defaultCookieFile,
  saveContextCookie
} from '@GTU/Playwright/browserCookie'

let LAST_ACTIVE_PAGE:TBrowserPage
export const defaultStateFile = 'browser-context-state'

/**
 * Sets up the global browser for the test environment
 *
 * @returns {Object} - Playwright Browser object
 */
export const setupBrowser = async () => {
  
  /** GOBLET_BROWSER is set by the task `keg goblet bdd run` */
  const { GOBLET_BROWSER=`chromium` } = process.env
  const type = GOBLET_BROWSER || global?.__goblet?.browser?.type
  
  const parkin = global.getParkinInstance()
  const gCtx = get<TBrowserContextOpts>(global, `__goblet.context.options`, emptyObj)
  const { browser, context } = await getPWComponents({
    type,
    ...get(global, `__goblet.browser`, emptyObj),
    context: {
      ...gCtx,
      extraHTTPHeaders: {
        ...gCtx?.extraHTTPHeaders,
        ...parkin?.world?.$context?.extraHTTPHeaders,
        ...parkin?.world?.$headers
      }
    }
  })


  if (!browser)
    throw new Error(`Failed to create ${GOBLET_BROWSER} browser`)


  if(!context)
    throw new Error(`Failed to create ${GOBLET_BROWSER} browser context`)

  global.browser = browser as TBrowser
  global.context = context as TBrowserContext

}

/**
 * Sets up the global context for the test environment
 *
 * @returns {Object} - Playwright Context object
 */
export const setupContext = async () => {
  // const context = await getContext()
  // const page = await getPage()
  // const parkin = global.getParkinInstance()

  await startTracing(global.context)

  // setBrowserDefaults({
  //   repo: { world: parkin.world },
  //   browserConf: global.browser.__goblet,
  //   pwComponents: {
  //     page,
  //     context,
  //     browser: global.browser
  //   }
  // })

  return global.context as TBrowserContext
}

/**
 * Gets the storage location from the temp-directory
 */
export const contextStateLoc = (saveLocation:string) => {
  const tempDir = os.tmpdir()
  const location = `${(saveLocation || defaultStateFile).split(`.json`).shift()}.json`

  return path.join(tempDir, location)
}

/**
 * Save storage state into the file.
 */
export const saveContextState = async (
  context:TBrowserContext,
  location?:string
):TContextStorageState => {
  return await context.storageState({ path: contextStateLoc(location) })
}

/**
 * Gets the browser context instance, or else creates a new one
 *
 */
export const getContext = async () => {
  if(!global.context)
    throw new Error(`Failed to find browser context. Did it one get created?`)

  return global.context as TBrowserContext
}

/**
 * Gets the browser page instance, or else creates a new one
 * @param {number} num - The page number to get if multiple exist
 *
 * @return {Object} - Playwright browser page object
 */
export const getPage = async (num = 0) => {
  const context = await getContext()

  const pages = context.pages() || []
  const page = pages.length ? pages[num] : await context.newPage()
  LAST_ACTIVE_PAGE = page
  // LAST_ACTIVE_PAGE = ghostMouse(page)

  return LAST_ACTIVE_PAGE as TBrowserPage
}

export const getLastActivePage = () => LAST_ACTIVE_PAGE as TBrowserPage
export const setLastActivePage = (page:TBrowserPage) => {
  LAST_ACTIVE_PAGE = page
}

export const closePage = async (page:TBrowserPage) => {
  const pg = page || await getPage()
  
  if (!pg) return console.warn(`Could not close browser page, because it does not exist.`)

  await pg.close()
  LAST_ACTIVE_PAGE = undefined

}

export const closeContext = async () => {
  const context = await getContext()

  await context.close()
  global.context = undefined
}

export const closeBrowser = async () => {
  if (!global.browser)
    return console.warn(`Could not close browser, because it does not exist.`)

  await global.browser.close()
  global.browser = undefined
}

export {
  browserCookieLoc,
  setContextCookie,
  defaultCookieFile,
  saveContextCookie,
}