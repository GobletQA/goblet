const { getPage } = require('@GTU/Playwright/browserContext')

/**
 * Finds an element on the current page as a locator
 * @param {String} selector
 * @return {Locator?} - the Playwright.Locator object found with `selector`, or null if it does not exist
 */
const getLocator = async (selector, waitFor=true) => {
  const page = await getPage()
  const locator = await page.locator(selector)
  if (!locator) throw new Error(`The element with selector "${selector}" could not be found.`)

  if(waitFor)
    typeof waitFor === `object`
      ? await locator.waitFor(waitFor)
      : await locator.waitFor()

  return locator
}

module.exports = { getLocator }
