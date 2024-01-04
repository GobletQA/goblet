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
import { exists } from '@keg-hub/jsutils/exists'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import {
  GBrowser,
  DefaultStateFile,
  addPageCloseEvts,
} from '@gobletqa/browser'


/**
 * Helper to merge the args together needed for getting the playwright browser
 */
const mergeBrowserArgs = (repo?:TGobletConfig) => {
  const gobletOpts = global?.__goblet ?? emptyObj
  const config = repo || gobletOpts?.config

  /** GOBLET_BROWSER is set by the task `keg goblet bdd run` */
  const type = process.env.GOBLET_BROWSER
    || gobletOpts?.browser?.type
    || `chromium`


  // Parkin holds an instance of the world object
  // So we use that to get access to the world
  const parkin = global.getParkinInstance()
  const contextOpts = (gobletOpts?.context?.options ?? emptyObj) as TBrowserContextOpts

  return {
    config,
    browserConf: {
      type,
      ...gobletOpts?.browser,
      context: {
        ...contextOpts,
        extraHTTPHeaders: {
          ...contextOpts?.extraHTTPHeaders,
          ...parkin?.world?.$context?.extraHTTPHeaders,
        }
      }
    }
  }
}

/**
 * Sets up the global browser for the test environment
 *
 * @returns {Object} - Playwright Browser object
 */
export const setupBrowser = async (repo?:TGobletConfig) => {

  const args = mergeBrowserArgs(repo)
  const browserType = args.browserConf.type

  const { browser, context } = await GBrowser.get(args)

  if (!browser)
    throw new Error(`Failed to create ${browserType} browser`)

  if(!context)
    throw new Error(`Failed to create ${browserType} browser context`)

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
export const getContext = () => {
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
  const context = getContext()
  const pages = context.pages() || []

  let page:TBrowserPage

  if(pages.length)
    page = exists(num)
      ? pages[num]
      : pages.find(pg => pg && !pg?.isClosed?.())

  if(!page) page = await context.newPage()

  global.page = page
  addPageCloseEvts(page)

  return page as TBrowserPage
}

export const getLastActivePage = () => global.page as TBrowserPage

export const closePages = async () => {
  const context = getContext()
  const pages = context.pages() || []
  return await Promise.all(pages.map(async (page) => await page.close()))
}

export const closePage = async (pg?:TBrowserPage, retry:number=1) => {
  const page = pg
    || global.page
    || await getPage(0, true)

  if(!page) return

  page && await page.close()

  if(page === global.page) global.page = undefined
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
