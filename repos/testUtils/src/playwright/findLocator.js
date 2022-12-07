const { getPage } = require('@GTU/Playwright/browserContext')

const prefixes = [
  `#`,
  `.`,
  `[`,
  
]

const searchTypes = {
  element: (sel) => sel,
  id: (sel) => `#${sel}`,
  class: (sel) => `.${sel}`,
  title: (sel) => `[title="${sel}"]`,
  aria: (sel) => `[aria-label="${sel}"]`,
  text: (sel) => `text="${sel}"`,
}

const getSelectorType = (selector) => {
  const prefix = selector[0]
  if(prefixes.includes(prefix)) return selector
  if(selector.startsWith(`data-`)) return `[${selector}]`

}


const loopFind = async (page, selector) => {
  
  
}


/**
 * Finds an element on the current page as a locator
 * @param {String} selector
 * @return {Locator?} - the Playwright.Locator object found with `selector`, or null if it does not exist
 */
const findLocator = async (selector, waitFor=true) => {
  const page = await getPage()
  const locator = await page.locator(selector)

  if (!locator) throw new Error(`The element with selector "${selector}" could not be found.`)

  if(waitFor)
    typeof waitFor === `object`
      ? await locator.waitFor(waitFor)
      : await locator.waitFor()

  return locator
}

module.exports = { findLocator }
