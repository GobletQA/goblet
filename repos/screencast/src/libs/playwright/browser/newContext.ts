import type { TBrowserConf } from '@GSC/types'

import { newBrowser } from './newBrowser'
import { Logger } from '@GSC/utils/logger'
import { noOpObj } from '@keg-hub/jsutils'
import { getBrowser, getContext, setContext } from './browser'
import { getContextOpts } from '../helpers/getContextOpts'

/**
 * Checks if the browser already exists
 * If it does not, then it create it
 * @function
 * @private
 * @param {Object} browserConf - Config used when starting the browser via playwright
 *
 * @returns {Object} - The playwright browser context object, and isNew state
 */
const ensureBrowser = async (browserConf:TBrowserConf = noOpObj as TBrowserConf) => {
  const pwBrowser = getBrowser(browserConf.type)
  if (pwBrowser) return pwBrowser

  const { browser } = await newBrowser(browserConf) as any
  return browser
}

/**
 * Checks if the browser context already exists
 * If it does not, then it create it
 * @function
 * @private
 *
 * @returns {Object} - The playwright browser context object
 */
const ensureContext = async (browser, browserConf:TBrowserConf) => {
  const pwContext = getContext(browserConf.type)
  if (pwContext) return pwContext

  const browserType = browserConf.type || browser.browserType().name()

  const contextOpts = getContextOpts(browserConf.context)
  Logger.info(`Creating new ${browserType} Browser Context with options`, contextOpts)
  const context = await browser.newContext(contextOpts)

  setContext(context, browserType)

  return context
}

/**
 * Starts new browser context from the running browser
 * @function
 * @private
 * @param {Object} browserConf - Config used when starting the browser via playwright
 *
 * @returns {Object} - Contains the context, and browser created from playwright
 */
export const newContext = async (browserConf:TBrowserConf = noOpObj as TBrowserConf) => {
  const browser = await ensureBrowser(browserConf)
  const context = await ensureContext(browser, browserConf)

  return { browser, context }
}

