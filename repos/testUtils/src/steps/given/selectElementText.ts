import type { TStepCtx } from '@GTU/Types'

import { Given } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'
import {
  ExpressionKinds,
  ExpressionTypes,
} from '@GTU/Constants'

export const selectElementText = async (
  selector:string,
  ctx:TStepCtx
) => {

  const locator = getLocator(selector)

  await locator.evaluate((element, {}) => {
    const selection = window.getSelection()

    const inputTypes = ['INPUT','TEXTAREA','SELECT']
    if(inputTypes.includes(element.tagName)){
      // @ts-ignore
      return element.select()
    }

    const range = document.createRange()
    range.selectNode(element)
    window.getSelection().removeAllRanges()
    window.getSelection().addRange(range)

  }, {})
}

const meta = {
  name: `Select element text`,
  alias: [ `text`, `select`],
  module: `selectElementText`,
  examples: [
    `I select the text of the element "#text-content"`
  ],
  description: `Locates an element, and selects its text content`,
  expressions: [
    {
      type: ExpressionTypes.string,
      kind: ExpressionKinds.element,
      description: `The selector for the element to have it's text selected`,
      example: `a#my-link`,
    },
  ],
  race: true
}


Given(`I select the text of the element {string}`, selectElementText, meta) 
