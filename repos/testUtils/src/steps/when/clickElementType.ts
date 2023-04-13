import type { TWorldConfig } from '@ltipton/parkin'

import { When } from '@GTU/Parkin'
import { clickElementHandler } from './clickElement'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

const attrTypes = [`.`, `#`, `$`, `#`, `:`, `(`, `>`]

export const checkSelectorType = (selector:string, world:TWorldConfig) => {
  const check = selector.trim()
  return attrTypes.find(attr => check.startsWith(attr))
    ? selector
    : ` :text("${check}")`
}

export const clickElementTypeHandler = async (
  type:string,
  selector:string,
  world:TWorldConfig
) => {
  const formatted = checkSelectorType(selector, world)
  const joined = `${type}${formatted}`

  return await clickElementHandler(joined, world)
}

const meta = {
  module: `clickElements`,
  description: `Locates an element by selector and clicks it. If the passed in expression does not start with a special character it is treated as text, and will use the :text() selector when locating the element`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.selector,
      description: `The selector of an element that exists on the page`,
      example: `"> [name='my-element']", ".my-button", or "My link text"`,
    },
  ],
  race: true,
}

When(`I click the link {string}`, (
  link:string,
  world:TWorldConfig
) => clickElementTypeHandler(`a`, link, world), {
  ...meta,
  name: `Click link`,
  module: `clickElements - Link`,
  examples: [`When I click the link "my-link"`],
})

When(`I click the button {string}`, (
  button:string,
  world:TWorldConfig
) => clickElementTypeHandler(`button`, button, world), {
  ...meta,
  name: `Click button`,
  module: `clickElements - Button`,
  examples: [`When I click the button "Submit"`],
})
