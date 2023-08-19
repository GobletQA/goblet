import type { TLocOpts, TLocator } from '@GTU/Types'

import { getLastActivePage } from '@GTU/Playwright/browserContext'


/**
 * Locator method that does not need to be awaited
 */
export const getLocator = (selector:string, opts?:TLocOpts) => {
  const page = getLastActivePage()
  return page.locator(selector, opts).first() as TLocator
}
