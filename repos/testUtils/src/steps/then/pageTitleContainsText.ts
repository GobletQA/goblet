import type { TWorldConfig } from '@ltipton/parkin'

import { Then } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'

/**
 * Checks that the page title is `title`
 * @param {*} title - text to compare to page title
 */
export const pageTitleContainsText = async (
  title:string,
  world:TWorldConfig
) => {
  const page = await getPage()
  const actualTitle = await page.title()
  // TODO: update to use expect contains text for better test output
  expect(actualTitle.includes(title)).toBe(true)
}

Then('the page title contains {string}', pageTitleContainsText, {
  description: `Verifies page title contains the string.`,
  expressions: [
    {
      type: 'string',
      description: `String expected to be contained within the page title.`,
      example: 'Goblet Blog',
    },
  ],
  module: `pageTitleContainsText`
})

