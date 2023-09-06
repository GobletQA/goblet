import type {
  TBrowser,
  TBrowserPage,
  TGobletConfig,
  TBrowserContext,
  TBrowserContextOpts,
  TContextStorageState,
} from '@GTU/Types'

import os from 'os'
import path from 'path'
import { get } from '@keg-hub/jsutils/get'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import {
  GBrowser,
  DefaultStateFile,
} from '@gobletqa/browser'

let LAST_ACTIVE_PAGE:TBrowserPage


/**
 * Sets up the global browser for the test environment
 *
 * @returns {Object} - Playwright Browser object
 */
export const setupBrowser = async (repo?:TGobletConfig) => {
  
  /** GOBLET_BROWSER is set by the task `keg goblet bdd run` */
  const { GOBLET_BROWSER=`chromium` } = process.env
  const type = GOBLET_BROWSER || global?.__goblet?.browser?.type
  
  // Parkin holds an instance of the world object
  // So we use that to get access to the world
  const parkin = global.getParkinInstance()
  const gCtx = get<TBrowserContextOpts>(global, `__goblet.context.options`, emptyObj)
  const { browser, context } = await GBrowser.get({
    config: repo || global?.__goblet?.config,
    browserConf: {
      type,
      ...get(global, `__goblet.browser`, emptyObj),
      context: {
        ...gCtx,
        extraHTTPHeaders: {
          ...gCtx?.extraHTTPHeaders,
          ...parkin?.world?.$context?.extraHTTPHeaders,
        }
      }
    }
  })

  if (!browser)
    throw new Error(`Failed to create ${GOBLET_BROWSER} browser`)

  if(!context)
    throw new Error(`Failed to create ${GOBLET_BROWSER} browser context`)

  context.on(`close`, () => global.context = undefined)
  browser.on(`disconnected`, () => global.browser = undefined)

  global.browser = browser as TBrowser
  global.context = context as TBrowserContext

  return { browser, context }

}


/**
 * Gets the storage location from the temp-directory
 */
export const contextStateLoc = (saveLocation:string) => {
  const tempDir = os.tmpdir()
  const location = `${(saveLocation || DefaultStateFile).split(`.json`).shift()}.json`

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
export const getPage = async (num = 0, fromClosePage:boolean=false) => {
  const context = await getContext()

  const pages = context.pages() || []
  const page = pages.length
    ? pages[num]
    : fromClosePage
      ? undefined
      : await context.newPage()

  global.page = page
  LAST_ACTIVE_PAGE = page
  page.on(`close`, () => {
    if(page === LAST_ACTIVE_PAGE) LAST_ACTIVE_PAGE = undefined
    if(page === global.page) global.page = undefined
  })
  page.on(`crash`, (data) => {
    console.error(`ERROR - Browser page crashed`)
    console.log(data)
  })

  return LAST_ACTIVE_PAGE as TBrowserPage
}

export const getLastActivePage = () => LAST_ACTIVE_PAGE as TBrowserPage
global.getLastActivePage = getLastActivePage

export const setLastActivePage = (page:TBrowserPage) => (LAST_ACTIVE_PAGE = page)
global.setLastActivePage = setLastActivePage

export const closePages = async () => {
  const context = await getContext()
  const pages = context.pages() || []
  return Promise.all(pages.map(async (page) => await page.close()))
}

export const closePage = async (pg?:TBrowserPage, retry:number=1) => {
  const page = pg
    || LAST_ACTIVE_PAGE
    || global.page
    || await getPage(0, true)

  if(!page) return

  page && await page.close()

  if(page === global.page) global.page = undefined
  if(page === LAST_ACTIVE_PAGE) LAST_ACTIVE_PAGE = undefined
}

export const closeContext = async () => {
  const context = await getContext()
  await context?.close()
}

export const closeBrowser = async () => {
  if (!global.browser)
    return console.warn(`Could not close browser, because it does not exist.`)

  await closeContext()
  await global.browser.close()
}
