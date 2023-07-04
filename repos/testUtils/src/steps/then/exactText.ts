import type { TStepCtx } from '@GTU/Types'

import { Then } from '@GTU/Parkin'
import { getLocatorContent } from '@GTU/Support/helpers'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

/**
 * Checks that element, matching `selector`, value (input & textarea elements) or textContent, is equal to `data`
 * @param {string} selector - valid playwright selector
 * @param {string} data - text to compare to selector value/textContent
 */
export const exactText = async (
  selector:string,
  data:string,
  ctx:TStepCtx
) => {

  const content = await getLocatorContent(selector)
  expect(content).toEqual(data)
}

const meta = {
  name: `Exact Text`,
  alias: [`Text`],
  module: `exactText`,
  description: `Locates an element by selector and verifies element text matches exactly.`,
  examples: [
    `Then the element "div.name" text is "Mr. Goblet"`
  ],
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The selector for a single element.`,
      example: `#search`,
    },
    {
      kind: ExpressionKinds.text,
      type: ExpressionTypes.string,
      description: `The text of the element to verify.`,
      example: `goblet`,
    },
  ],
  race: true
}

Then('{string} text is {string}', exactText, meta)
Then('the element {string} text is {string}', exactText, {
  ...meta,
  race: false
})
