import type { TWorldConfig } from '@ltipton/parkin'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

import { When } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'


/**
 * Sets the input text of selector to data
 * @param {string} selector - valid playwright selector
 * @param {string} data - set selector text to `data`
 * @param {Object} world
 */
export const focusElement = async (selector:string, world:TWorldConfig) => {
  const element = await getLocator(selector)
  return await element.focus()
}

const meta = {
  name: `Focus element`,
  alias: [],
  module: `focusElement`,
  examples: [
    `When I focus on the element "input[name=email]"`
  ],
  description: `Locates element and focuses on a specific element.`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The selector for a single input element.`,
      example: `input[name=email]`,
    },
  ],
  race: true
}

When(`I focus on {string}`, focusElement, meta)
When(`I focus on the element {string}`, focusElement, {
  ...meta,
  race: false
})
