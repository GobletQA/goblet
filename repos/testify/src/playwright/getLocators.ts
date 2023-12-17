import { getPage } from '@GTU/Playwright/browserContext'
import type { TLocator } from '@GTU/Types'

type TLocatorCB = <T=any>(...args:any[]) => T

/**
 * Not currently being used
 * Helper methods for a locator list
 */
const iterators = {
  map: async function (locators:TLocator[], callback:TLocatorCB) {
    const count = locators.length
    const mapped = []
    for (let i = 0; i < count; ++i){
      const locator = locators[i]
      const resp = callback(locator, i)
      mapped.push(resp)
    }

    return mapped
  },
  forEach: async function (locators:TLocator[], callback:TLocatorCB) {
    const count = locators.length
    for (let i = 0; i < count; ++i){
      const locator = locators[i]
      callback(locator, i)
    }
  },
  reduce: async function (locators:TLocator[], callback:TLocatorCB, response) {
    const count = locators.length
    let acc = response
    for (let i = 0; i < count; ++i){
      const locator = locators[i]
      acc = callback(acc, locator, i)
    }
    return acc
  },
  evaluate: async function (locators:TLocator[], callback:TLocatorCB) {
    return await locators?.[0]?.evaluateAll?.(callback)
  },
}

/**
 * Not currently being used
 * Bind the locators iterators methods to the locators object
 * If the key already exists log a warning so we know it needs to be updated
 */
const addIterators = (locators) => {
  Object.entries(iterators).forEach(([key, method]) => {
    !locators[key]
      ? (locators[key] = method.bind(locators))
      : console.warn(`The Locators helper method ${key} already exists on the Locators object.`)
  })
  
  return locators
}

/**
 * @param {String} selector
 * @return {Locator?} - the Playwright.Locator object found with `selector`, or null if it does not exist
 */
export const getLocators = async (selector) => {
  const page = await getPage()
  const locators = page.locator(selector)
  if (!locators) throw new Error(`The element with selector "${selector}" could not be found.`)

  return locators
}

