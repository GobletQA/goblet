import type { TGetIframe, TGetIframeLocator } from '@GTU/Types'
import { getLastActivePage } from '@GTU/Playwright/browserContext'

const getPage = () => {
  const page = getLastActivePage()
  if(!page)
    throw new Error([
      `Browser page could not be found.`,
      `Try restarting the browser if the problem persists.`
    ].join(`\n`))

  return page
}

/**
 * Finds an element from selector or locator, and clicks it
 * @param {TGetIframe} props
 *
 */
export const getIframe = ({ iframe }:TGetIframe) => {
  const page = getPage()
  return page.frameLocator(iframe)
}

/**
 * Finds an element from selector or locator, and clicks it
 * @param {TGetIframeLocator} props
 *
 */
export const getFrameLocator = (props:TGetIframeLocator) => {
  const { selector, iframe, frame } = props
  const frameLocator = frame || getIframe({ iframe })

  return frameLocator.locator(selector)
}

export const getILocator = (iframe:string, selector:string) => getFrameLocator({iframe, selector})
