const { getPage } = require('@GTU/Playwright/browserContext')

/**
 * TODO: figure out how to set global timeout from the browser or cli
 * The pull it in here and use it to set the config of the waitFor
 */
const getLocationWaitOpts = (waitFor) => {
  // process.env.JEST_WORKER_ID
  const defWaitOpts = {
    timeout: 5000,
    state: `visible`,
  }

  // waitFor must be explicitly set to false to skip waitFor options
  return waitFor === false
    ? undefined
    : typeof waitFor === `object`
      ? { ...defWaitOpts, ...waitFor }
      : defWaitOpts
}

/**
 * Finds an element on the current page as a locator
 * @param {string} selector
 * @return {locator?} - the Playwright.Locator object found with `selector`, or null if it does not exist
 */
const getLocator = async (selector, waitFor=true) => {
  const page = await getPage()
  const locator = await page.locator(selector)
  if (!locator) throw new Error(`The element with selector "${selector}" could not be found.`)

  const opts = getLocationWaitOpts(waitFor)
  opts ? await locator.waitFor(opts) : await locator.waitFor()

  return locator
}

module.exports = { getLocator }
