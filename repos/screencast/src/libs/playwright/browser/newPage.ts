import type { TBrowserConf, TBrowserContext } from '@GSC/types'

import { newContext } from './newContext'
import { noOpObj } from '@keg-hub/jsutils'
import { getPageOpts } from '../helpers/getPageOpts'
import { getPage, getContext, setPage } from './browser'

/**
 * Checks if the browser context already exists
 * If it does not, then it create it
 * @function
 * @private
 * @param {Object} browserConf - Options for starting the browser
 *
 * @returns {Object} - The playwright browser context object, and isNew state
 */
const ensureContext = async (browserConf:TBrowserConf) => {
  const pwContext = getContext(browserConf.type)
  if (pwContext) return pwContext

  // If no context exists, try to create it
  const { context } = await newContext(browserConf)
  return context
}

/**
 * Checks if the browser page already exists
 * If it does not, then it create it
 * @function
 * @private
 * @param {Object} context - The playwright browser context object
 * @param {Object} browserConf - Options for starting the browser
 *
 * @returns {Object} - The playwright browser page object
 */
const ensurePage = async (context:TBrowserContext, browserConf:TBrowserConf) => {
  const pwPage = getPage(browserConf.type)
  if (pwPage) return pwPage

  const page = await context.newPage(getPageOpts(browserConf.page))
  setPage(page, browserConf.type)

  return page
}

/**
 * Creates a new page from the current context and navigates to the passed in url
 * Also ensure the context exists before creating the page
 * @function
 * @private
 * @param {Object} browserConf - Options for starting the browser
 *
 * @returns {Object} - Contains the page, and context created from playwright
 */
export const newPage = async (browserConf:TBrowserConf = noOpObj as TBrowserConf) => {
  const context = await ensureContext(browserConf)
  const page = await ensurePage(context, browserConf)

  return { context, page }
}
