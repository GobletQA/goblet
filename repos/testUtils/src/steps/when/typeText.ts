import type { TWorldConfig } from '@ltipton/parkin'

import { When } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'
import { getWorldData } from '@GTU/Support/helpers'
import { SavedLocatorWorldPath } from '@GTU/Constants'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

type TLocator = Record<string, any>

const typeText = async (
  element:TLocator,
  data:string
) => {
  //clear value before setting otherwise data is appended to end of existing value
  await element.fill('')
  await element.type(data)
}

export const typeWithSaved = async (
  data:string,
  world:TWorldConfig
) => {
  const { element } = getWorldData(SavedLocatorWorldPath, world)
  const el = element || await getLocator(`:focus`)

  await typeText(el, data)
}

/**
 * Sets the input text of selector to data
 */
export const typeWithSelector = async (
  data:string,
  selector:string=`:focus`,
  world:TWorldConfig
) => {
  const element = await getLocator(selector)
  await typeText(element, data)
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
      kind: ExpressionKinds.selector,
      type: ExpressionTypes.string,
      description: `The selector of an element that allows input. One of Input, Textarea, or [content-editable]`,
      example: `#search-input`,
    },
  ],
}

When(`I write {string}`, typeWithSaved, meta)
When(`I type {string}`, typeWithSaved, meta)
When(`I type {string} into {string}`, typeWithSelector, {
  ...meta,
  name: `Type Text`,
  alias: [`Write text`, `Input text`],
  info: `Action to simulate typing text into an element on the page`,
  race: true
})
When(`I type {string} into the element {string}`, typeWithSelector, meta)

