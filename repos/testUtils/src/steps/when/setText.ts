import type { TWorldConfig } from '@ltipton/parkin'

import { When } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'
import { fillInput, getWorldLocator } from '@GTU/Support/helpers'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

export const setTextWithSaved = async (
  text:string,
  world:TWorldConfig
) => {
  const { selector, element } = getWorldLocator(world)
  const locator = element || await getLocator(`:focus`)
 
  return await fillInput({
    text,
    world,
    locator,
    selector,
  })
}

/**
 * Sets the input text of selector to data
 */
export const setTextWithSelector = async (
  text:string,
  selector:string,
  world:TWorldConfig
) => {
  return await fillInput({
    text,
    world,
    selector,
  })
}

const meta = {
  name: `Set text`,
  alias: [`fill`],
  module: `setText`,
  examples: [
    `When I set the text "my.name@company.com" to element "input[name=email]" `
  ],
  description: `Locates input element by selector and replaces existing value, if any, to the desired text.`,
  expressions: [
    {
      kind: ExpressionKinds.text,
      type: ExpressionTypes.string,
      example: `Some text in the element`,
      description: `Desired text to set in the input element.`,
    },
    {
      example: `#search`,
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The selector for a single input element.`,
    },
  ],
  race: true
}

When(`I set the text to {string}`, setTextWithSaved, {
  ...meta,
  name: `Set input value`,
  expressions: [meta.expressions[0]],
  examples: [`I set the text to "some text"`],
})

When(`I set the text {string} to the element {string}`, setTextWithSelector, meta)

