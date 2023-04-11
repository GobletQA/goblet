import type {
  TLocator,
  TLocatorTypeMap,
  TGetLocationOpts,
  TLocatorMapMethod,
} from '@GTU/Types'

import { emptyObj } from '@keg-hub/jsutils'
import { getPage } from '@GTU/Playwright/browserContext'

export const locatorTypeMap:TLocatorTypeMap = {
  [`title`]: async (page, selector) => await page.getByTitle(selector),
  [`label`]: async (page, selector) => await page.getByLabel(selector),
  [`placeholder`]: async (page, selector) => await page.getByPlaceholder(selector),
  [`role`]: (async (page, selector, options) => await page.getByRole(selector, options)) as TLocatorMapMethod,
  [`text`]: (async (page, selector, options) => await page.getByText(selector, options)) as TLocatorMapMethod,
}

type TLocatorTypeKey = keyof typeof locatorTypeMap
export const allowedLocatorTypes = Object.keys(locatorTypeMap) as TLocatorTypeKey[]


/**
 * Finds an element on the current page as a locator based on teh passed in type
 * @param {String} selector
 * @return <Locator?> - the Playwright.Locator object found with `selector`, or null if it does not exist
 */
export const getLocatorType = async (
  selector:string,
  type:string|TLocatorTypeKey=`text`,
  options:TGetLocationOpts=emptyObj
) => {
  const { page, waitFor=true, ...opts } = options
  
  if(!allowedLocatorTypes.includes(type as TLocatorTypeKey))
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

  return locator as TLocator
}

export const getLocatorByText = (
  selector:string,
  options=emptyObj
) => getLocatorType(selector, `text`, options)
export const getLocatorByRole = (
  selector:string,
  options=emptyObj
) => getLocatorType(selector, `role`, options)
export const getLocatorByLabel = (
  selector:string,
  options=emptyObj
) => getLocatorType(selector, `label`, options)
export const getLocatorByTitle = (
  selector:string,
  options=emptyObj
) => getLocatorType(selector, `title`, options)
export const getLocatorByPlaceholder = (
  selector:string,
  options=emptyObj
) => getLocatorType(selector, `placeholder`, options)
