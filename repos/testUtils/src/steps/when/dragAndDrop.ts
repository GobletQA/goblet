import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'
import { getStepTimeout } from '@GTU/Support'
import { ExpressionKinds, ExpressionTypes } from '@GTU/Constants'

/**
 * Drags and drops one element on to another
 */
export const dragAndDrop = async (
  dragSelector:string,
  parentSelector:string,
  ctx:TStepCtx
) => {
  const dragEl = getLocator(dragSelector)
  const parentEl = getLocator(parentSelector)

  return await dragEl.dragTo(parentEl, { timeout: getStepTimeout(ctx) })
}

const meta = {
  name: `Drag and drop element`,
  alias: [],
  module: `dragAndDrop`,
  examples: [
    `When I drag and drop the element "div#item-1" on to the element "div#items-container"`
  ],
  description: `Locates element, then drags and drops it on to another element`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The selector for the element to drag and drop`,
      example: `div#item-1`,
    },
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The selector for the element to be dropped onto`,
      example: `div#items-container`,
    },
  ],
  race: true,
}

When(`I drag {string} on to {string}`, dragAndDrop, meta)
When(`I drag and drop the element {string} on to the element {string}`, dragAndDrop, {
  ...meta,
  race: false
})
