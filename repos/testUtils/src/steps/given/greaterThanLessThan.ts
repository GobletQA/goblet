import type { TWorldConfig } from '@ltipton/parkin'

import { Given } from '@GTU/Parkin'
import { getLocators } from '@GTU/Playwright'
import { greaterLessEqual } from '@GTU/Support/helpers'

/**
 * Expects the number of dom elements matching `selector` to match `count` based on the comparison screen
 * @param {string} selector - valid playwright selector
 * @param {number} count - expected number of selectors in the DOM
 */
export const greaterThanLessThan = async (
  selector:string,
  type:string,
  count:number,
  world:TWorldConfig
) => {
  const elements = await getLocators(selector)
  const current = await elements.count()

  greaterLessEqual(current, count, type)
}

Given('the count of {string} is {string} than/to {int}', greaterThanLessThan, {
  module : `greaterThanLessThan`,
  description: `Locates elements by selector and verifies count is greater than or less than a number`,
  expressions: [
    {
      type: 'string',
      description: `The selector for the elements.`,
      example: 'div.listing',
    },
    {
      type: 'string',
      description: `The word or symbol that defines the validation check. Must be one of ${greaterLessEqual.matchTypes}`,
      example: '<',
    },
    {
      type: 'int',
      description: `Integer. The count to verify.`,
      example: '5',
    },
  ],
})
