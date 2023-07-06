import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

/**
 * Drags and drops one element on to another
 */
export const dragAndDrop = async (
  dragSelector:string,
  parentSelector:string,
  ctx:TStepCtx
) => {
  const dragEl = await getLocator(dragSelector, ctx)
  const parentEl = await getLocator(parentSelector, ctx)

  return await dragEl.dragTo(parentEl)
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
