import type { TWorldConfig } from '@ltipton/parkin'

import { Then } from '@GTU/Parkin'
import { getLocatorContent } from '@GTU/Support/helpers'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

/**
 * Checks that element, matching `selector`, value (input & textarea elements) or textContent, contains `data`
 * @param {string} selector - valid playwright selector
 * @param {string} data - text to compare to selector value/textContent
 */
export const containsText = async (
  selector:string,
  data:string,
  world:TWorldConfig
) => {
  const content = await getLocatorContent(selector)
  expect(content).toEqual(expect.stringContaining(data))
}

const meta = {
  name: `Contains Text`,
  alias: [`Has Text`],
  module: `containsText`,
  description: `Locates an element by selector and verifies element contains text. If the value is an input element such as an Input, Textarea, or Select, the value of the input is used.`,
  examples: [
    `Then the element "div.temp" contains the text "85°"`,
  ],
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The selector for a single element.`,
      example: `div.weather-container >> div.temp`,
    },
    {
      kind: ExpressionKinds.text,
      type: ExpressionTypes.string,
      description: `The text of the element to verify.`,
      example: `the temperature is 85°`,
    },
  ],
  race: true
}

Then(`{string} contains {string}`, containsText, meta)
Then(`{string} contains the text {string}`, containsText, {
  ...meta,
  race: false
})
Then(`the element {string} contains the text {string}`, containsText, {
  ...meta,
  race: false
})
