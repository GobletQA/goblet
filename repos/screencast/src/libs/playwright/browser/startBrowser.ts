import type { TBrowserConf } from '@GSC/types'

import { newPage } from './newPage'
import { noOpObj } from '@keg-hub/jsutils'
import { buildStatus } from '../helpers/buildStatus'
import { getPage, getContext, getBrowser } from './browser'

/**
 * Starts browser using playwright
 * See {@link https://playwright.dev/docs/api/class-browsertype#browser-type-launch|Playwright Docs} for more info
 * @function
 * @public
 */
export const startBrowser = async (
  browserConf:TBrowserConf = noOpObj as TBrowserConf
) => {
  await newPage(browserConf)

  const pwComponents = {
    page: getPage(browserConf.type),
    context: getContext(browserConf.type),
    browser: getBrowser(browserConf.type),
  }

  // Build the status object for the newly started browser
  const status = buildStatus(
    browserConf.type,
    Boolean(pwComponents.browser && pwComponents.context && pwComponents.page),
  )

  return { status, ...pwComponents }
}

