import { getPage } from '@GTU/Playwright/browserContext'

/**
 * @param {String} selector
 * @return {ElementHandle?} - the Playwright.ElementHandle object found with `selector`, or null if it does not exist
 */
export const getElement = async (selector:string) => {
  const page = await getPage()
  const element = await page.$(selector)
  if (!element) throw new Error(`The element with selector "${selector}" could not be found.`)

  return element
}
