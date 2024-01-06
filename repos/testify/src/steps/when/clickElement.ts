import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
import { getIframe, getILocator } from '@GTU/Playwright'
import { clickElement } from '@GTU/Support/helpers'
import { ExpressionKinds, ExpressionTypes, ExpressionElements } from '@gobletqa/environment/constants'

/**
 * Click the element matching `selector`
 * @param {String} selector - valid playwright selector
 */
export const clickElementHandler = async (
  selector:string,
  ctx:TStepCtx
) => {
  return await clickElement({ selector }, ctx)
}

/**
 * TODO: Temp step until the step tags system can be implemented
 */
export const clickIframeElementHandler = async (
  frame:string,
  selector:string,
  ctx:TStepCtx
) => {
  const locator = getILocator(frame, selector)
  return await clickElement({ locator })
}

const meta = {
  name: `Click element`,
  module: `clickElement`,
  examples: [
    `When I click "button[name='unique_name']"`,
    `When I click the element "button[name='unique_name']"`,
  ],
  description: `Locates an element by selector and clicks it.`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The selector of an element that exists on the page`,
      example: `button[name='btn-name']`,
    },
  ],
}

When(`I click {string}`, clickElementHandler, {
  ...meta,
  alias: [`Touch`, `Press`],
  info: `Action to simulate clicking, touching, or pressing an element on the page`,
  race: true
})
When(`I click the {string}`, clickElementHandler, meta)
When(`I click the element {string}`, clickElementHandler, meta)
When(`I click the page`, async (ctx:TStepCtx) => await clickElementHandler(`body`, ctx), {
  ...meta,
  name: `Click page`,
  expressions: [],
  examples: [`When I click the page`],
  race: true
})

When(`I click iframe {string} element {string}`, clickIframeElementHandler, {
  ...meta,
  name: `Click iframe element`,
  alias: [`Touch`, `Press`],
  info: `Action to simulate clicking, touching, or pressing an element within an iframe`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.iframe,
      kindRef: ExpressionElements.iframe,
      description: `The selector of an iframe that exists on the page`,
      example: `iframe#sub-page`,
    },
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The selector of an element that exists on the page`,
      example: `button[name='btn-name']`,
    },
  ],
  race: true
})
