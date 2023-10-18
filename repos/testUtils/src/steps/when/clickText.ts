import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
import { clickElement } from '@GTU/Support/helpers'
import { getLocatorByText } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@GTU/Constants'

/**
 * Click the element matching `selector`
 * @param {String} selector - valid playwright selector
 */
export const clickTextHandler = async (selector:string, ctx:TStepCtx) => {
  const locator = await getLocatorByText(selector)
  return await clickElement({ locator }, ctx)
}

const meta = {
  module: `clickText`,
  examples: [
    `When I click text "Submit Form"`,
    `When I click the text "Submit Form"`,
  ],
  description: `Locates an element by text and clicks it.`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.text,
      description: `The text content of an element that should be clicked that exists on the page`,
      example: `Submit Form`,
    },
  ],
}

When(`I click text {string}`, clickTextHandler, {
  ...meta,
  name: `Click text`,
  alias: [`Touch`, `Press`],
  info: `Action to simulate clicking, touching, or pressing an element on the page`,
  race: true
})
When(`I click the text {string}`, clickTextHandler, meta)
