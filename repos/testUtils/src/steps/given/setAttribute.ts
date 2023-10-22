import type { TStepCtx } from '@GTU/Types'

import { Given } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'
import {
  ExpressionKinds,
  ExpressionTypes,
} from '@GTU/Constants'

export const setAttribute = async (
  selector:string,
  attr:string,
  value:string,
  ctx:TStepCtx
) => {
  const page = await getPage()

  await page.evaluate(({ selector, attr, value }) => {
    const element = document.querySelector(selector)
    element.setAttribute(attr, value)
  }, { selector, attr, value })
}

const meta = {
  name: `Set Attribute`,
  alias: [ `attributes`, `attr`],
  module: `changeTarget`,
  examples: [
    `I set the element "#image-id" attribute "src" to "https://example.com/custom-image.png"`
  ],
  description: `Locates an element, and sets the specified attributes value`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The selector for the element to have it's attribute set`,
      example: `a#my-link`,
    },
    {
      example: `src`,
      label: `Attribute`,
      type: ExpressionTypes.string,
      kind: ExpressionKinds.attribute,
      description: `The name of the elements attribute to set`,
    },
    {
      example: `https://example.com/custom-image.png`,
      label: `Value`,
      type: ExpressionTypes.string,
      kind: ExpressionKinds.text,
      description: `The value the attribute should be set to`,
    },
  ],
  race: true
}


Given(`I set the element {string} attribute {string} to {string}`, setAttribute, meta) 