import type {
  TStepCtx,
  TBrowser,
  TBrowserPage,
  TBrowserContext,
  TBrowserContextOpts,
  TContextStorageState
} from '@GTU/Types'

import os from 'os'
import path from 'path'
import { startTracing } from './tracing'
import { get, noOpObj } from '@keg-hub/jsutils'
import {
  metadata,
  ghostMouse,
  startBrowser,
  setBrowserDefaults,
} from '@gobletqa/screencast/libs/playwright'

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
  const { GOBLET_BROWSER='chromium' } = process.env
  const { type, browserConf } = await metadata.read(GOBLET_BROWSER)

  // TODO: Should update to check if in docker container
  // Then pass false based on that
  // Pass false to bypass checking the browser status
  const browserOpts = {
    ...browserConf,
    type,
    ...get(global, `__goblet.browser.options`, noOpObj),
  }

  const { browser } = await startBrowser(browserOpts, true)

  if (!browser)
    throw new Error(`Could not create browser. Please ensure the browser server is running.`)

  global.browser = browser
  global.browser.__goblet = {
    ...global.browser.__goblet,
    ...browserOpts
  }

  return global.browser as TBrowser
}

/**
 * Sets up the global context for the test environment
 *
 * @returns {Object} - Playwright Context object
 */
export const setupContext = async () => {
  global.context = await getContext(
    get<TBrowserContextOpts>(global, `__goblet.context.options`)
  )
  await startTracing(global.context)

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
 * @param {Object} [contextOpts] - Options for creating a new context
 * @param {string} [location] - path the browser will use for storage
 *
 */
export const getContext = async (
  contextOpts?:TBrowserContextOpts,
  location?:string
) => {
  // TODO: migrate this to use the getContext from screencast/libs/playwright
  contextOpts = contextOpts || get<TBrowserContextOpts>(global, `__goblet.context.options`, noOpObj)

  if(!global.browser) throw new Error('Browser type not initialized')
  if(!global.context){
    try {
      // TODO: figure out how to pull the saved context state 
      global.context = await global.browser.newContext({
        ...contextOpts,
        // TODO: Need to add this dynamically based on some env or tag?
        // storageState: contextStateLoc(location)
      }) as TBrowserContext
    }
    catch(err){
      if(err.code === `ENOENT` && err.message.includes(`Error reading storage state`))
        console.warn(`[Goblet] Saved Context State ${location} does not exist.`)
      else global.context = await global.browser.newContext(contextOpts) as TBrowserContext
    }
  }

  // Goblet options that are context specific
  // Not great, and there's better way to store this,
  // because we don't own the context object, but this works now
  global.context.__goblet = global.context.__goblet || {}

  return global.context as TBrowserContext
}

/**
 * Gets the browser page instance, or else creates a new one
 * @param {number} num - The page number to get if multiple exist
 *
 * @return {Object} - Playwright browser page object
 */
export const getPage = async (num = 0) => {
  if (!global.context) throw new Error('No browser context initialized')

  const pages = global.context.pages() || []
  const page = pages.length ? pages[num] : await global.context.newPage()
  LAST_ACTIVE_PAGE = ghostMouse(page)

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
  if (!global.context)
    return console.warn(`Could not close browser context, because it does not exist.`)

  await global.context.close()
  global.context = undefined
}

export const closeBrowser = async () => {
  if (!global.browser)
    return console.warn(`Could not close browser, because it does not exist.`)

  await global.browser.close()
  global.browser = undefined
}

export const restartContext = async (ctx:TStepCtx) => {
  const { world } = ctx
  
  // global.__goblet.context.options // Browser Context Options
  // global.__goblet.context.options.recordVideo // string path to video save directory
  // global.context.__goblet.cookie // string path to saved cookie
  // global.context.__goblet.extraHTTPHeaders // Record<string, string>
  // global.context.__goblet.tracing // boolean
  // const gobletCtxOpts = global?.context?.__goblet || {}

  // Cache the url so we can reset it
  const _page = await getPage()
  const url = _page.url()

  await closeContext()

  const context = await getContext()
  const page = await getPage()
  setBrowserDefaults({
    url,
    world,
    browserConf: global.browser.__goblet,
    pwComponents: { context, page }
  })

}

export {
  browserCookieLoc,
  setContextCookie,
  defaultCookieFile,
  saveContextCookie,
}