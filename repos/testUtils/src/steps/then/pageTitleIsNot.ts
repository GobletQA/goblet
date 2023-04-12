import type { TWorldConfig } from '@ltipton/parkin'

import expect from 'expect'
import { Then } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'

/**
 * Checks that the page title is not `title`
 * @param {string} title - text to compare to page title
 */
export const pageTitleIsNot = async (title:string, world:TWorldConfig) => {
  const page = await getPage()
  expect(await page.title()).not.toBe(title)
}

Then('the page title is not {string}', pageTitleIsNot, {
  description: `Verifies page title does not match expected string.`,
  expressions: [
    {
      type: 'string',
      description: `String that does not match page title.`,
      example: 'Goblet Blog',
    },
  ],
  module: `pageTitleIsNot`
})
