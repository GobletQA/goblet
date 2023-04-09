import type { TWorldConfig } from '@ltipton/parkin'

import { Then } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'

/**
 * Checks that the page title is `title`
 * @param {*} title - text to compare to page title
 */
export const pageTitleIs = async (title:string, world:TWorldConfig) => {
  const page = await getPage()
  const actualTitle = await page.title()
  expect(title).toBe(actualTitle)
}

Then('the page title is {string}', pageTitleIs, {
  description: `Verifies page title matches the expected string.`,
  expressions: [
    {
      type: 'string',
      description: `String expected to match the page title.`,
      example: 'Goblet Blog',
    },
  ],
  module: `pageTitleIs`
})


