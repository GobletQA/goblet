import type { TWorldConfig } from '@ltipton/parkin'

import { Then } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'

/**
 * Expects the number of dom elements matching `selector` to equal `count`
 * @param {string} selector - valid playwright selector
 * @param {number} count - expected number of selectors in the DOM
 */
export const elementCount = async (
  selector:string,
  count:number,
  world:TWorldConfig
) => {
  const page = await getPage()
  const elements = await page.$$(selector)
  expect(elements.length).toEqual(count)
}

Then('the count of {string} is/equals {int}', elementCount, {
  module: `elementCount`,
  description: `Locates elements by selector and verifies count.`,
  expressions: [
    {
      type: 'string',
      description: `The selector for the elements.`,
      example: 'div.listing',
    },
    {
      type: 'int',
      description: `Integer.  The count to verify.`,
      example: '5',
    },
  ],
})
