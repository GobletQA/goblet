import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'
import { clearInput, getWorldLocator } from '@GTU/Support/helpers'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

export const clearTextWithSaved = async (
  ctx:TStepCtx
) => {
  const { world } = ctx
  const { selector, element } = getWorldLocator(world)
  const locator = element || await getLocator(`:focus`)
 
  return await clearInput({
    world,
    locator,
    selector,
  })
}

/**
 * Sets the input text of selector to data
 */
export const setTextWithSelector = async (
  selector:string,
  ctx:TStepCtx
) => {
  const { world } = ctx
  return await clearInput({
    world,
    selector,
  })
}

const meta = {
  name: `Clear text`,
  alias: [`clear`, `text`],
  module: `clearText`,
  examples: [
    `When I clear the element "input[name=email]"`
  ],
  description: `Locates input element by selector and clears the existing value`,
  expressions: [
    {
      example: `#search`,
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The selector for a single input element.`,
    },
  ],
  race: true
}

When(`I clear the element {string}`, setTextWithSelector, {
  ...meta,
  name: `Clear element value`,
  expressions: [meta.expressions[0]],
  examples: [`I set the text to "some text"`],
  fromSavedLocator: true,
})

When(`I clear the text`, clearTextWithSaved, {
  ...meta,
  expressions: [],
  fromSavedLocator: true,
  examples: [`I clear the text`],
  name: `Clear active element value`,
})


