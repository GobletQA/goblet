import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
import { clickElement } from '@GTU/Support/helpers'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

const attrTypes = [`internal`, `.`, `#`, `$`, `#`, `:`, `(`, `>`]

export const checkSelectorType = (selector:string, ctx:TStepCtx) => {
  const check = selector.trim()
  return attrTypes.find(attr => check.startsWith(attr))
    ? selector
    : ` :text("${check}")`
}

export const clickElementTypeHandler = async (
  type:string,
  selector:string,
  ctx:TStepCtx
) => {
  const { world } = ctx
  const formatted = checkSelectorType(selector, ctx)
  const joined = formatted.startsWith(`internal`)
    ? formatted
    : `${type}${formatted}`

  return await clickElement({ selector: joined, world })
}

const meta = {
  module: `clickElements`,
  description: `Locates an element by selector and clicks it. If the passed in expression does not start with a special character it is treated as text, and will use the :text() selector when locating the element`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The selector of an element that exists on the page`,
      example: `"> [name='my-element']", ".my-button", or "My link text"`,
    },
  ],
  race: true,
}

When(`I click the link {string}`, (
  link:string,
  ctx:TStepCtx
) => clickElementTypeHandler(`a`, link, ctx), {
  ...meta,
  name: `Click link`,
  module: `clickElements - Link`,
  examples: [`When I click the link "my-link"`],
})

When(`I click the button {string}`, (
  button:string,
  ctx:TStepCtx
) => clickElementTypeHandler(`button`, button, ctx), {
  ...meta,
  name: `Click button`,
  module: `clickElements - Button`,
  examples: [`When I click the button "Submit"`],
})
