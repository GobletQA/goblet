import type { TLocator } from '@GTU/Types'

import { getPage } from '@GTU/Playwright/browserContext'

const prefixes = [
  `#`,
  `.`,
  `[`,
]

const searchTypes = {
  element: (sel:string) => sel,
  id: (sel:string) => `#${sel}`,
  class: (sel:string) => `.${sel}`,
  title: (sel:string) => `[title="${sel}"]`,
  aria: (sel:string) => `[aria-label="${sel}"]`,
  text: (sel:string) => `text="${sel}"`,
}

const getSelectorType = (selector:string) => {
  const prefix = selector[0]
  if(prefixes.includes(prefix)) return selector
  if(selector.startsWith(`data-`)) return `[${selector}]`
}

/**
 * Finds an element on the current page as a locator
 * @param {String} selector
 * @return <Locator?> - the Playwright.Locator object found with `selector`, or null if it does not exist
 */
export const findLocator = async (
  selector:string,
  waitFor:boolean=true
) => {
  const page = await getPage()
  const locator = await page.locator(selector)

  if (!locator) throw new Error(`The element with selector "${selector}" could not be found.`)

  if(waitFor)
    typeof waitFor === `object`
      ? await locator.waitFor(waitFor)
      : await locator.waitFor()

  return locator as TLocator
}

