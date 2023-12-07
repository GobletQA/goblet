import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
import { getLocatorTimeout } from '@GTU/Support'
import {
  getIframe,
  getLocator,
  getILocator,
} from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes, ExpressionElements } from '@GTU/Constants'

const iframeExp = {
  example: `iframe#sub-page`,
  type: ExpressionTypes.string,
  kind: ExpressionKinds.iframe,
  kindRef: ExpressionElements.iframe,
  description: `The selector of an iframe that exists on the page`,
}

/**
 * Drags and drops one element on to another
 */
export const dragAndDrop = async (
  dragSelector:string,
  receivingSelector:string,
  ctx:TStepCtx
) => {
  const dragEl = getLocator(dragSelector)
  const receivingEl = getLocator(receivingSelector)

  return await dragEl.dragTo(receivingEl, { timeout: getLocatorTimeout(ctx) })
}

/**
 * TODO: Temp step until the step tags system can be implemented
 */
export const dragFromIframeAndDrop = async (
  frame:string,
  dragSelector:string,
  receivingSelector:string,
  ctx:TStepCtx
) => {

  const dragEl = getILocator(frame, dragSelector)
  const receivingEl = getLocator(receivingSelector)

  return await dragEl.dragTo(receivingEl, { timeout: getLocatorTimeout(ctx) })
}

export const dragIntoIframeAndDrop = async (
  dragSelector:string,
  frame:string,
  receivingSelector:string,
  ctx:TStepCtx
) => {
  const dragEl = getLocator(dragSelector)
  const receivingEl = getILocator(frame, receivingSelector)

  return await dragEl.dragTo(receivingEl, { timeout: getLocatorTimeout(ctx) })
}

export const dragWithinIframeAndDrop = async (
  frame:string,
  dragSelector:string,
  receivingSelector:string,
  ctx:TStepCtx
) => {
  const iframe = getIframe({ iframe:frame })
  const dragEl = iframe.locator(dragSelector)
  const receivingEl = iframe.locator(receivingSelector)

  return await dragEl.dragTo(receivingEl, { timeout: getLocatorTimeout(ctx) })
}

export const dragBetweenIframesAndDrop = async (
  startFrame:string,
  dragSelector:string,
  endFrame:string,
  receivingSelector:string,
  ctx:TStepCtx
) => {

  const dragEl = getILocator(startFrame, dragSelector)
  const receivingEl = getILocator(endFrame, receivingSelector)

  return await dragEl.dragTo(receivingEl, { timeout: getLocatorTimeout(ctx) })
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

When(`I drag {string} on to {string}`, dragAndDrop, {
  ...meta,
  race: true,
})

When(`I drag and drop the element {string} onto the element {string}`, dragAndDrop, {
  ...meta,
  race: false
})

/**
 * TODO: Temp step until the step tags system can be implemented
 */
When(`I drag iframe {string} element {string} onto {string}`, dragFromIframeAndDrop, {
  ...meta,
  expressions: [
    iframeExp,
    ...meta.expressions
  ],
  race: true,
})

When(`I drag element {string} onto iframe {string} element {string}`, dragIntoIframeAndDrop, {
  ...meta,
  expressions: [
    meta.expressions[0],
    iframeExp,
    meta.expressions[1]
  ],
  race: true,
})

When(`I drag within iframe {string} element {string} onto element {string}`, dragWithinIframeAndDrop, {
  ...meta,
  expressions: [
    iframeExp,
    ...meta.expressions
  ],
  race: true,
})

When(`I drag from iframe {string} element {string} onto iframe {string} element {string}`, dragBetweenIframesAndDrop, {
  ...meta,
  expressions: [
    iframeExp,
    meta.expressions[0],
    iframeExp,
    meta.expressions[1]
  ],
  race: true,
})
