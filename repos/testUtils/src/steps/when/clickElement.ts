import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
import { clickElement } from '@GTU/Support/helpers'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

/**
 * Click the element matching `selector`
 * @param {String} selector - valid playwright selector
 */
export const clickElementHandler = async (
  selector:string,
  ctx:TStepCtx
) => {
  const { world } = ctx
  return await clickElement({ world, selector })
}


const meta = {
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
  name: `Click element`,
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
