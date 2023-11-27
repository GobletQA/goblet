import type { TStepCtx } from '@GTU/Types'

import { Given } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'
import { saveWorldData } from '@GTU/Support/helpers'
import {
  ExpressionKinds,
  ExpressionTypes,
  ExpressionCustomInputs,
} from '@GTU/Constants'

export const saveAttribute = async (
  selector:string,
  attr:string,
  worldPath:string,
  ctx:TStepCtx
) => {
  const locator = getLocator(selector)
  const attrVal = await locator.evaluate((element, { attr }) => element.getAttribute(attr), { attr })
  const { world } = ctx
  expect(attrVal).not.toBe(undefined)
  saveWorldData({ attrVal }, world, worldPath)

}

const meta = {
  name: `Set attribute`,
  alias: [ `attributes`, `attr`],
  module: `changeTarget`,
  examples: [
    `I set the element "#image-id" attribute "src" to "https://example.com/custom-image.png"`
  ],
  description: `Locates an element, and sets the specified attributes value`,
  expressions: [
    {
      label: `Selector`,
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The selector for the element to have it's attribute saved`,
      example: `a#my-link`,
    },
    {
      example: `src`,
      label: `Attribute`,
      type: ExpressionTypes.string,
      kind: ExpressionKinds.attribute,
      description: `The name of the elements attribute to saved`,
    },
    {
      label: `World Path`,
      example: `element.attr.src`,
      kind: ExpressionKinds.world,
      type: ExpressionTypes.string,
      kindRef: ExpressionCustomInputs.world,
      description: `Path on the world where the count should be saved`,
    },
  ],
  race: true
}


Given(`I set the element {string} attribute {string} to {string}`, saveAttribute, meta) 
