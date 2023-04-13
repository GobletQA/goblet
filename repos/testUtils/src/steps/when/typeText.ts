import type { TWorldConfig } from '@ltipton/parkin'

import { When } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'
import { typeInput, getWorldLocator } from '@GTU/Support/helpers'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'


export const typeWithSaved = async (
  text:string,
  world:TWorldConfig
) => {
  const { selector, element } = getWorldLocator(world)
  const locator = element || await getLocator(`:focus`)
 
  return await typeInput({
    text,
    world,
    locator,
    selector,
  })
}

/**
 * Sets the input text of selector to data
 */
export const typeWithSelector = async (
  text:string,
  selector:string=`:focus`,
  world:TWorldConfig
) => {
  return await typeInput({
    text,
    world,
    selector,
  })
}

const meta = {
  module: `typeText`,
  examples: [
    `When I write "some text"`,
    `When I type "my.name@company.com" into the element "input[name=email]"`
  ],
  description: `Locates input element by selector and replaces existing value, if any, to the desired text.`,
  expressions: [
    {
      kind: ExpressionKinds.text,
      type: ExpressionTypes.string,
      description: `Text that will be typed into the input.`,
      example: `Enter some text...`,
    },
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The selector of an element that allows input. One of Input, Textarea, or [content-editable]`,
      example: `#search-input`,
    },
  ],
}

When(`I type {string}`, typeWithSaved, {
  ...meta,
  race: true,
  name: `Type text`,
  expressions: [meta.expressions[0]]
})
When(`I write {string}`, typeWithSaved, meta)
When(`I type {string} into {string}`, typeWithSelector, {
  ...meta,
  name: `Type text in input`,
  alias: [`Write text`, `Input text`],
  info: `Action to simulate typing text into an element on the page`,
  race: true
})
When(`I type {string} into the element {string}`, typeWithSelector, meta)

