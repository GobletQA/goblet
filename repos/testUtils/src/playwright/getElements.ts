import { getPage } from '@GTU/Playwright/browserContext'

/**
 * @param {String} selector
 * @return {Array<ElementHandle>} - array of Playwright.ElementHandle objects found with `selector`. May be empty.
 */
export const getElements = async (selector:string) => {
  const page = await getPage()
  return page.$$(selector)
}

