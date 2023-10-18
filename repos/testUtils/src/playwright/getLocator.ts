import type { TLocOpts, TLocator } from '@GTU/Types'

import { getLastActivePage } from '@GTU/Playwright/browserContext'


/**
 * Locator method that does not need to be awaited
 */
export const getLocator = (selector:string, opts?:TLocOpts) => {
  const page = getLastActivePage()
  if(!page)
    throw new Error([
      `Browser page could not be found.`,
      `Try restarting the browser if the problem persists.`
    ].join(`\n`))

  return page.locator(selector, opts).first() as TLocator
}
