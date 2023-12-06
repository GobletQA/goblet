import type { TGetIframe } from '@GTU/Types'
import { getLastActivePage } from '@GTU/Playwright/browserContext'


/**
 * Finds an element from selector or locator, and clicks it
 * @param {TClickEl} params
 *
 */
export const getIframe = ({ iframe }:TGetIframe) => {
  const page = getLastActivePage()
  if(!page)
    throw new Error([
      `Browser page could not be found.`,
      `Try restarting the browser if the problem persists.`
    ].join(`\n`))

  return page.frameLocator(iframe)
}

