const { getPage } = require('@GTU/Playwright/browserContext')
const { emptyObj } = require('@keg-hub/jsutils')

const locatorTypeMap = {
  [`title`]: async (page, selector) => await page.getByTitle(selector),
  [`label`]: async (page, selector) => await page.getByLabel(selector),
  [`placeholder`]: async (page, selector) => await page.getByPlaceholder(selector),
  [`role`]: async (page, selector, options) => await page.getByRole(selector, options),
  [`text`]: async (page, selector, options) => await page.getByText(selector, options),
}

const allowedLocatorTypes = Object.keys(locatorTypeMap)

/**
 * Finds an element on the current page as a locator based on teh passed in type
 * @param {String} selector
 * @return {Locator?} - the Playwright.Locator object found with `selector`, or null if it does not exist
 */
const getLocatorType = async (selector, type=`text`, options=emptyObj) => {
  const { page, waitFor=true, ...opts } = options
  
  if(!allowedLocatorTypes.includes(type))
    throw new Error([
      `The locator type "${type}" is not allowed.`,
      `Please use one of the following allowed types:\n`,
      allowedLocatorTypes.join(' | ')
    ].join(` `))


  const activePage = page || await getPage()

  const locator = await locatorTypeMap[type](activePage, selector, opts)
  if (!locator) throw new Error(`Element of type "${type}" using selector "${selector}" could not be found.`)

  if(waitFor)
    typeof waitFor === `object`
      ? await locator.waitFor(waitFor)
      : await locator.waitFor()

  return locator
}

const getLocatorByText = (selector, options=emptyObj) => getLocatorType(selector, `text`, options)
const getLocatorByRole = (selector, options=emptyObj) => getLocatorType(selector, `role`, options)
const getLocatorByLabel = (selector, options=emptyObj) => getLocatorType(selector, `label`, options)
const getLocatorByTitle = (selector, options=emptyObj) => getLocatorType(selector, `title`, options)
const getLocatorByPlaceholder = (selector, options=emptyObj) => getLocatorType(selector, `placeholder`, options)

module.exports = {
  locatorTypeMap,
  allowedLocatorTypes,
  getLocatorType,
  getLocatorByText,
  getLocatorByRole,
  getLocatorByLabel,
  getLocatorByTitle,
  getLocatorByPlaceholder,
}
