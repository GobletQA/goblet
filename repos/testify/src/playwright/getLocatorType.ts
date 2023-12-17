import type {
  TLocator,
  TLocatorTypeMap,
  TGetLocationOpts,
} from '@GTU/Types'

import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { getPage } from '@GTU/Playwright/browserContext'

export const locatorTypeMap:TLocatorTypeMap = {
  [`title`]: async (page, selector):Promise<TLocator> => (
    await page.getByTitle(selector) as TLocator
  ),
  [`label`]: async (page, selector):Promise<TLocator> => (
    await page.getByLabel(selector) as TLocator
  ),
  [`placeholder`]: async (page, selector):Promise<TLocator> => (
    await page.getByPlaceholder(selector) as TLocator
  ),
  [`role`]: async (page, selector, options):Promise<TLocator> => (
    await page.getByRole(selector as any, options) as TLocator
  ),
  [`text`]: async (page, selector, options):Promise<TLocator> => (
    await page.getByText(selector, options) as TLocator
  ),
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
  const { page, waitFor, ...opts } = options
  
  if(!allowedLocatorTypes.includes(type as TLocatorTypeKey))
    throw new Error([
      `The locator type "${type}" is not allowed.`,
      `Please use one of the following allowed types:\n`,
      allowedLocatorTypes.join(' | ')
    ].join(` `))


  const activePage = page || await getPage()

  const locator:TLocator = await locatorTypeMap[type](activePage, selector, opts)
  if (!locator) throw new Error(`Element of type "${type}" using selector "${selector}" could not be found.`)

  if(waitFor)
    typeof waitFor === `object`
      ? await locator.waitFor(waitFor)
      : await locator.waitFor({ timeout: 5000 })

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
