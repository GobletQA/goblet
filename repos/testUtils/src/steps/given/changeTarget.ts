import type { TStepCtx } from '@GTU/Types'

import { Given } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'
import {
  ExpressionKinds,
  ExpressionTypes,
  ExpressionElements,
} from '@gobletqa/environment/constants'

const targetOpts = [
  `_self`,
  `_blank`,
  `_parent`,
  `_top`
]

export const setTarget = async (
  selector:string,
  target:string,
  ctx:TStepCtx
) => {
  const locator = getLocator(selector)

  await locator.evaluate((element, { target }) => {
    element.setAttribute(`target`, target)
  }, { target })

}

const meta = {
  name: `Change Link Target`,
  alias: [ `link`, `target`, `attributes`, `attr`],
  module: `changeTarget`,
  examples: [
    `I change the link "#blog-link" target to "_self"`
  ],
  description: `Locates a link element, and changes it's target attribute`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      kindRef: ExpressionElements.link,
      description: `The selector for the element to have it's target attribute changed`,
      example: `a#my-link`,
    },
    {
      example: `_self`,
      label: `Target`,
      options: targetOpts,
      type: ExpressionTypes.string,
      kind: ExpressionKinds.options,
      description: `The value that the target attribute should be`,
    },
  ],
  race: true
}


Given(`I change the link {string} target to {string}`, setTarget, meta) 