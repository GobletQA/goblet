import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'
import { getLocatorTimeout } from '@GTU/Support'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/environment/constants'

/**
 * Sets the input text of selector to data
 */
export const hoverElement = async (selector:string, ctx:TStepCtx) => {
  const element = getLocator(selector)
  await element.hover({ timeout: getLocatorTimeout(ctx) })

  return true
}

const meta = {
  name: `Hover over element`,
  alias: [],
  module: `hoverElement`,
  examples: [
    `When I hover over the element "button[name=submit]"`
  ],
  description: `Locates element and moves the mouse to hover over it.`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The selector for the element to hover over`,
      example: `input[name=email]`,
    },
  ],
  race: true,
}

When(`I hover over {string}`, hoverElement, meta)
When(`I hover over the element {string}`, hoverElement, {
  ...meta,
  race: false
})
