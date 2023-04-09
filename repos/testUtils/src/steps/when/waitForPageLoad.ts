import type { TWorldConfig } from '@ltipton/parkin'

import { When } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'

/**
 * Returns when the required load state has been reached.
 * Without specifying any arguments, it by default waits for the load event to fire.
 * Read more here: https://playwright.dev/docs/api/class-page#pagewaitforloadstatestate-options
 */
export const waitForPageLoad = async (world:TWorldConfig) => {
  const page = await getPage()
  await page.waitForLoadState()
}

When('I wait for the page to load', waitForPageLoad, {
  module: `waitForPageLoad`,
  description: `Waits for load event to fire.\nPreceding step should be something that causes a page load such as a refresh, submitting a form, clicking a link, etc.\nIf the page load event has already fired before reaching this step the step resolves immediately.`,
  examples: [
    `And I wait for the page to load`
  ]
})

