import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
import { getILocator, getLocator } from '@GTU/Playwright'
import { typeInput, getWorldLocator } from '@GTU/Support/helpers'
import { ExpressionKinds, ExpressionTypes, ExpressionElements } from '@GTU/Constants'


export const typeWithSaved = async (
  text:string,
  ctx:TStepCtx
) => {
  const { world } = ctx
  const { selector, element } = getWorldLocator(world)
  const locator = element || getLocator(`:focus`)
 
  return await typeInput({
    text,
    locator,
    selector,
  }, ctx)
}

/**
 * Sets the input text of selector
 */
export const typeWithSelector = async (
  text:string,
  selector:string=`:focus`,
  ctx:TStepCtx
) => {
  return await typeInput({
    text,
    selector,
  }, ctx)
}

/**
 * TODO: Temp step until the step tags system can be implemented
 */
export const typeWithIframeSelector = async (
  text:string,
  frame:string,
  selector:string,
  ctx:TStepCtx
) => {
  return await typeInput({
    text,
    locator: getILocator(frame, selector),
  }, ctx)
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
  fromSavedLocator: true,
  expressions: [meta.expressions[0]]
})

When(`I write {string}`, typeWithSaved, meta)
When(`I type {string} into {string}`, typeWithSelector, {
  ...meta,
  name: `Type text into input`,
  alias: [`Write text`, `Input text`],
  info: `Action to simulate typing text into an element on the page`,
  race: true
})
When(`I type {string} into the element {string}`, typeWithSelector, meta)

When(`I type {string} into iframe {string} element {string}`, typeWithIframeSelector, {
  ...meta,
  name: `Type text into iframe input`,
  alias: [`Write text`, `Input text`],
  info: `Action to simulate typing text into an element within an iframe`,
  expressions: [
    {
      kind: ExpressionKinds.text,
      type: ExpressionTypes.string,
      description: `Text that will be typed into the input.`,
      example: `Enter some text...`,
    },
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
      description: `The selector of an element that allows input. One of Input, Textarea, or [content-editable]`,
      example: `#search-input`,
    },
  ],
  race: true
})
