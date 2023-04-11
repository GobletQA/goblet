import type { TBrowserContextOpts } from '@GTU/Types'

import os from 'os'
import path from 'path'
import { startTracing } from './tracing'
import { get, noOpObj } from '@keg-hub/jsutils'
import { metadata } from '@gobletqa/screencast/libs/playwright'
import { startBrowser } from '@gobletqa/screencast/libs/playwright/browser/browser'
import {
  browserCookieLoc,
  setContextCookie,
  defaultCookieFile,
  saveContextCookie
} from '@GTU/Playwright/browserCookie'

let LAST_ACTIVE_PAGE
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
  const { browser } = await startBrowser({
    ...browserConf,
    type,
    ...get(global, `__goblet.browser.options`, noOpObj),
  }, true)

  if (!browser)
    throw new Error(`Could not create browser. Please ensure the browser server is running.`)

  global.browser = browser
  
  return global.browser
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

  return global.context
}

/**
 * Gets the storage location from the temp-directory
 */
export const contextStateLoc = (saveLocation) => {
  const tempDir = os.tmpdir()
  const location = `${(saveLocation || defaultStateFile).split(`.json`).shift()}.json`

  return path.join(tempDir, location)
}

/**
 * Save storage state into the file.
 */
export const saveContextState = async (context, location) => {
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
      })
    }
    catch(err){
      if(err.code === `ENOENT` && err.message.includes(`Error reading storage state`))
        console.warn(`[Goblet] Saved Context State ${location} does not exist.`)
      else global.context = await global.browser.newContext(contextOpts)
    }
  }
  // Goblet options that are context specific
  // Not great, and there's better way to store this,
  // because we don't own the context object, but this works now
  global.context.__goblet = global.context.__goblet || {}
  return global.context
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
  LAST_ACTIVE_PAGE = pages.length ? pages[num] : await global.context.newPage()

  return LAST_ACTIVE_PAGE
}

export const getLastActivePage = () => LAST_ACTIVE_PAGE
export const setLastActivePage = (page) => {
  LAST_ACTIVE_PAGE = page
}

export {
  browserCookieLoc,
  setContextCookie,
  defaultCookieFile,
  saveContextCookie,
}