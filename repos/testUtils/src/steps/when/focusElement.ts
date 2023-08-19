import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'
import { saveWorldLocator } from '@GTU/Support/helpers'
import { ExpressionKinds, ExpressionTypes } from '@GTU/Constants'

/**
 * Sets the input text of selector to data
 * @param {string} selector - valid playwright selector
 * @param {string} data - set selector text to `data`
 * @param {Object} world
 */
export const focusElement = async (selector:string, ctx:TStepCtx) => {
  const { world } = ctx
  const element = await getLocator(selector, ctx)
  const resp = await element.focus()
  saveWorldLocator({ selector, world, element }, ctx)

  return resp
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
  race: true,
  autoSaveLocator: true,
}

When(`I focus on {string}`, focusElement, meta)
When(`I focus on the element {string}`, focusElement, {
  ...meta,
  race: false
})
