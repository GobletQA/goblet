import type { TWorldConfig } from '@ltipton/parkin'

import { Given } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'

/**
 * Calls page.pause to stop test execution until playwright.resume() is called
 * Should be used for debugging only when running with a headed browser
 */
export const pagePause = async (world:TWorldConfig) => {
  const page = await getPage()
  await page.pause()
}

Given('I pause the page', pagePause, {
  module : `pagePause`,
  description: `Pauses the steps execution of a feature. Should be used for debugging only.`,
  expressions: [],
})

