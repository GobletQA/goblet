import type { TLocOpts, TLocator } from '@GTU/Types'

import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { getLastActivePage } from '@GTU/Playwright/browserContext'


/**
 * Locator method that does not need to be awaited
 */
export const getLocator = (selector:string, opts:TLocOpts=emptyObj) => {
  const {parent, ...options} = opts

  const page = parent || getLastActivePage()
  if(!page)
    throw new Error([
      `Browser page could not be found.`,
      `Try restarting the browser if the problem persists.`
    ].join(`\n`))

  return page.locator(selector, options).first() as TLocator
}
